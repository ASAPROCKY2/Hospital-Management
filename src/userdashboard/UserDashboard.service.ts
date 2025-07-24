// src/dashboard/user-dashboard.service.ts
import db from "../Drizzle/db";
import {
  AppointmentsTable,
  ComplaintsTable,
  PrescriptionsTable,
  PaymentsTable,
} from "../Drizzle/schema";
import { eq } from "drizzle-orm";

export const getUserDashboardStatsService = async (userId: number) => {
  // Count only this user's appointments
  const appointments = await db.query.AppointmentsTable.findMany({
    where: eq(AppointmentsTable.user_id, userId),
  });

  // Count only this user's prescriptions
  const prescriptions = await db.query.PrescriptionsTable.findMany({
    where: eq(PrescriptionsTable.patient_id, userId),
  });

  // Count only this user's complaints
  const complaints = await db.query.ComplaintsTable.findMany({
    where: eq(ComplaintsTable.user_id, userId),
  });

  // Sum up only this user's payments
  const payments = await db.query.PaymentsTable.findMany({
    where: eq(PaymentsTable.user_id, userId),
  });
  const totalPayments = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  return {
    appointments: appointments.length,
    prescriptions: prescriptions.length,
    complaints: complaints.length,
    payments: totalPayments,
  };
};
