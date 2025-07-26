import db from "../Drizzle/db";
import { PaymentsTable } from "../Drizzle/schema";
import { InferInsertModel, eq } from "drizzle-orm";

// ✅ Get proper type for inserts
type NewPayment = InferInsertModel<typeof PaymentsTable>;

/* -----------------------------------------------------------
   🔹 CRUD Services
----------------------------------------------------------- */

// Create a new payment record manually
export async function createPaymentService(data: NewPayment) {
  const [inserted] = await db.insert(PaymentsTable).values({
    appointment_id: data.appointment_id,
    user_id: data.user_id ?? null,
    amount: data.amount, // must be string for decimal
    payment_status: data.payment_status ?? "pending",
    transaction_id: data.transaction_id ?? null,
    payment_date: data.payment_date ?? null,
    created_at: new Date(),
    updated_at: new Date(),
  }).returning();
  return inserted;
}

// Fetch all payments
export async function getAllPaymentsService() {
  return await db.select().from(PaymentsTable);
}

// Fetch one payment by id
export async function getPaymentByIdService(paymentId: number) {
  const rows = await db.select().from(PaymentsTable)
    .where(eq(PaymentsTable.payment_id, paymentId));
  return rows[0] ?? null;
}

// Update payment by id
export async function updatePaymentService(paymentId: number, updates: Partial<NewPayment>) {
  const [updated] = await db.update(PaymentsTable)
    .set({ ...updates, updated_at: new Date() })
    .where(eq(PaymentsTable.payment_id, paymentId))
    .returning();
  return updated;
}

// Delete payment by id
export async function deletePaymentService(paymentId: number) {
  await db.delete(PaymentsTable).where(eq(PaymentsTable.payment_id, paymentId));
  return { message: "Payment deleted" };
}

// Get all payments for a specific appointment
export async function getPaymentsByAppointmentService(appointmentId: number) {
  return await db.select().from(PaymentsTable)
    .where(eq(PaymentsTable.appointment_id, appointmentId));
}

// Get full details for a payment (can be extended with joins)
export async function getFullPaymentDetailsService(paymentId: number) {
  const rows = await db.select().from(PaymentsTable)
    .where(eq(PaymentsTable.payment_id, paymentId));
  return rows[0] ?? null;
}

/* -----------------------------------------------------------
   🔹 M‑Pesa STK Push Logic
----------------------------------------------------------- */

// ENV variables
const consumerKey = process.env.MPESA_CONSUMER_KEY as string;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET as string;
const shortcode = process.env.MPESA_SHORTCODE as string;
const passkey = process.env.MPESA_PASSKEY as string;
const baseUrl = process.env.BASE_URL as string;

// Build timestamp
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

// Generate Mpesa password
function generatePassword(timestamp: string): string {
  const str = shortcode + passkey + timestamp;
  return Buffer.from(str).toString("base64");
}

// Get access token
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

// Save initial payment record
async function savePendingPayment(
  appointmentId: number,
  userId: number | null,
  amount: string,
  checkoutRequestId: string
) {
  await db.insert(PaymentsTable).values({
    appointment_id: appointmentId,
    user_id: userId,
    amount: amount,
    payment_status: "pending",
    transaction_id: checkoutRequestId,
    created_at: new Date(),
    updated_at: new Date(),
  });
}

// Initiate STK push
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
    CallBackURL: `${baseUrl}/payment-callback/${appointmentId}`,
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

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`STK push failed: ${res.status} - ${errorText}`);
  }

  const data = await res.json();

  // save payment record
  await savePendingPayment(appointmentId, userId, amount.toFixed(2), data.CheckoutRequestID);

  return {
    message: "STK Push initiated",
    MerchantRequestID: data.MerchantRequestID,
    CheckoutRequestID: data.CheckoutRequestID,
    CustomerMessage: data.CustomerMessage,
  };
}
