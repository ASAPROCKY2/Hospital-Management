// src/dashboard/dashboard.service.ts
import db from "../Drizzle/db";
import { UsersTable, DoctorsTable, AppointmentsTable, PaymentsTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";

export const getDashboardStatsService = async () => {
  // Count patients (assuming UsersTable has a role column)
  const patients = await db.query.UsersTable.findMany({
    where: eq(UsersTable.role, "user"),
  });

  // Count doctors
  const doctors = await db.query.DoctorsTable.findMany();

  // Count appointments
  const appointments = await db.query.AppointmentsTable.findMany();

  // Sum payments
  const payments = await db.query.PaymentsTable.findMany();
  const revenue = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return {
    patients: patients.length,
    doctors: doctors.length,
    appointments: appointments.length,
    revenue,
  };
};
