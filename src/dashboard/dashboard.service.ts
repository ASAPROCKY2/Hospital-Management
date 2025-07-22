// src/dashboard/dashboard.service.ts
import db from "../Drizzle/db";
import {
  UsersTable,
  DoctorsTable,
  AppointmentsTable,
  PaymentsTable,
  ComplaintsTable,
  PrescriptionsTable,
} from "../Drizzle/schema";
import { eq } from "drizzle-orm";

export const getDashboardStatsService = async () => {
  //  Count patients (users with role = "user")
  const patients = await db.query.UsersTable.findMany({
    where: eq(UsersTable.role, "user"),
  });

  //  Count doctors
  const doctors = await db.query.DoctorsTable.findMany();

  //  Count appointments
  const appointments = await db.query.AppointmentsTable.findMany();

  //  Sum up all payments
  const payments = await db.query.PaymentsTable.findMany();
  const revenue = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  //  Count complaints
  const complaints = await db.query.ComplaintsTable.findMany();

  //  Count prescriptions
  const prescriptions = await db.query.PrescriptionsTable.findMany();

  // Return all stats
  return {
    patients: patients.length,
    doctors: doctors.length,
    appointments: appointments.length,
    revenue,
    complaints: complaints.length,
    prescriptions: prescriptions.length,
  };
};
