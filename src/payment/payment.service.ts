// src/payment/payment.service.ts

import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { PaymentsTable, TIPayment } from "../Drizzle/schema";

// Create a new payment
export const createPaymentService = async (payment: TIPayment) => {
  await db.insert(PaymentsTable).values(payment);
  return "Payment recorded successfully";
};

// Get all payments
export const getAllPaymentsService = async () => {
  return await db.query.PaymentsTable.findMany({
    with: {
      appointment: true,
    },
  });
};

// Get payment by ID
export const getPaymentByIdService = async (id: number) => {
  return await db.query.PaymentsTable.findFirst({
    where: eq(PaymentsTable.payment_id, id),
    with: {
      appointment: true,
    },
  });
};

// Update payment by ID
export const updatePaymentService = async (
  id: number,
  data: Partial<TIPayment>
) => {
  await db.update(PaymentsTable).set(data).where(eq(PaymentsTable.payment_id, id));
  return "Payment updated successfully";
};

// Delete payment by ID
export const deletePaymentService = async (id: number) => {
  await db.delete(PaymentsTable).where(eq(PaymentsTable.payment_id, id));
  return "Payment deleted successfully";
};

// Get all payments for a specific appointment
export const getPaymentsByAppointmentService = async (appointmentID: number) => {
  return await db.query.PaymentsTable.findMany({
    where: eq(PaymentsTable.appointment_id, appointmentID),
    with: {
      appointment: true,
    },
  });
};

// Get full payment details including user and doctor via appointment
export const getFullPaymentDetailsService = async (id: number) => {
  return await db.query.PaymentsTable.findFirst({
    where: eq(PaymentsTable.payment_id, id),
    with: {
      appointment: {
        with: {
          user: true,
          doctor: true,
        },
      },
    },
  });
};
