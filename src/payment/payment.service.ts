import db from "../Drizzle/db";
import { PaymentsTable, AppointmentsTable } from "../Drizzle/schema"; // <-- Updated
import { InferInsertModel, eq } from "drizzle-orm";

// Types
type NewPayment = InferInsertModel<typeof PaymentsTable>;

/* -----------------------------------------------------------
   🔹 CRUD Services
----------------------------------------------------------- */

export async function createPaymentService(data: NewPayment) {
  const [inserted] = await db.insert(PaymentsTable).values({
    appointment_id: data.appointment_id,
    user_id: data.user_id ?? null,
    amount: data.amount,
    payment_status: data.payment_status ?? "pending",
    transaction_id: data.transaction_id ?? null,
    payment_date: data.payment_date ?? null,
    created_at: new Date(),
    updated_at: new Date(),
  }).returning();
  return inserted;
}

export async function getAllPaymentsService() {
  return await db.select().from(PaymentsTable);
}

export async function getPaymentByIdService(paymentId: number) {
  const rows = await db.select().from(PaymentsTable)
    .where(eq(PaymentsTable.payment_id, paymentId));
  return rows[0] ?? null;
}

export async function updatePaymentService(paymentId: number, updates: Partial<NewPayment>) {
  const [updated] = await db.update(PaymentsTable)
    .set({ ...updates, updated_at: new Date() })
    .where(eq(PaymentsTable.payment_id, paymentId))
    .returning();
  return updated;
}

export async function deletePaymentService(paymentId: number) {
  await db.delete(PaymentsTable).where(eq(PaymentsTable.payment_id, paymentId));
  return { message: "Payment deleted" };
}

export async function getPaymentsByAppointmentService(appointmentId: number) {
  return await db.select().from(PaymentsTable)
    .where(eq(PaymentsTable.appointment_id, appointmentId));
}

export async function getFullPaymentDetailsService(paymentId: number) {
  const rows = await db.select().from(PaymentsTable)
    .where(eq(PaymentsTable.payment_id, paymentId));
  return rows[0] ?? null;
}

/* -----------------------------------------------------------
   🔹 M-PESA Integration
----------------------------------------------------------- */

const consumerKey = process.env.MPESA_CONSUMER_KEY as string;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET as string;
const shortcode = process.env.MPESA_SHORTCODE as string;
const passkey = process.env.MPESA_PASSKEY as string;
const baseUrl = process.env.BASE_URL as string;

function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

function generatePassword(timestamp: string): string {
  const str = shortcode + passkey + timestamp;
  return Buffer.from(str).toString("base64");
}

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const res = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      method: "GET",
      headers: { Authorization: `Basic ${auth}` },
    }
  );
  if (!res.ok) throw new Error(`Failed to get access token: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function savePendingPayment(
  appointmentId: number,
  userId: number | null,
  amount: string,
  checkoutRequestId: string
) {
  await db.insert(PaymentsTable).values({
    appointment_id: appointmentId,
    user_id: userId,
    amount,
    payment_status: "pending",
    transaction_id: checkoutRequestId,
    created_at: new Date(),
    updated_at: new Date(),
  });
}

export async function initiatePaymentService(
  appointmentId: number,
  userId: number | null,
  phoneNumber: string,
  amount: number
) {
  const timestamp = getTimestamp();
  const password = generatePassword(timestamp);
  const token = await getAccessToken();

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: `${baseUrl}/payments/payment-callback?paymentid=${appointmentId}`,
    AccountReference: `APPT-${appointmentId}`,
    TransactionDesc: "Appointment Payment",
  };

  const res = await fetch(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const rawText = await res.text();
  console.log("Safaricom raw response:", rawText);

  if (!res.ok) {
    throw new Error(`STK push failed: ${res.status} - ${rawText}`);
  }

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    throw new Error(`Failed to parse Safaricom JSON: ${e} | Body: ${rawText}`);
  }

  await savePendingPayment(appointmentId, userId, amount.toFixed(2), data.CheckoutRequestID);

  return {
    message: "STK Push initiated",
    MerchantRequestID: data.MerchantRequestID,
    CheckoutRequestID: data.CheckoutRequestID,
    CustomerMessage: data.CustomerMessage,
  };
}

export async function handlePaymentCallbackService(body: any) {
  const callback = body?.Body?.stkCallback;
  if (!callback) {
    throw new Error("Invalid callback payload");
  }

  const resultCode = callback.ResultCode;
  const checkoutRequestID = callback.CheckoutRequestID;

  if (resultCode === 0) {
    const metadata = callback.CallbackMetadata?.Item || [];
    const receipt = metadata.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value || null;
    const amount = metadata.find((i: any) => i.Name === "Amount")?.Value || null;
    const paymentDate = new Date().toISOString().split("T")[0];

    console.log("M-Pesa payment success:", checkoutRequestID, "Receipt:", receipt);

    const [updatedPayment] = await db.update(PaymentsTable)
      .set({
        payment_status: "paid",
        transaction_id: receipt,
        amount: amount?.toString() ?? null,
        payment_date: paymentDate,
        updated_at: new Date(),
      })
      .where(eq(PaymentsTable.transaction_id, checkoutRequestID))
      .returning();

    if (!updatedPayment) {
      console.warn("No payment matched for update — possibly early callback");
      return { status: "paid", receipt };
    }

   
    if (updatedPayment.appointment_id) {
      await db.update(AppointmentsTable)
        .set({
          appointment_status: "Confirmed",
          updated_at: new Date(),
        })
        .where(eq(AppointmentsTable.appointment_id, updatedPayment.appointment_id));
    }

    return { status: "paid", receipt };
  } else {
    console.warn("M-Pesa payment failed/cancelled:", checkoutRequestID);

    await db.update(PaymentsTable)
      .set({
        payment_status: "failed",
        updated_at: new Date(),
      })
      .where(eq(PaymentsTable.transaction_id, checkoutRequestID));

    return { status: "failed", checkoutRequestID };
  }
}
