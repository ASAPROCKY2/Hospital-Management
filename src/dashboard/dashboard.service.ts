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
import { eq, sql } from "drizzle-orm";

// ✅ ================= MAIN DASHBOARD TOTALS =================
export const getDashboardStatsService = async () => {
  // Patients
  const patients = await db.query.UsersTable.findMany({
    where: eq(UsersTable.role, "user"),
  });

  // Doctors
  const doctors = await db.query.DoctorsTable.findMany();

  // Appointments
  const appointments = await db.query.AppointmentsTable.findMany();

  // Payments
  const payments = await db.query.PaymentsTable.findMany();
  const revenue = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  // Complaints
  const complaints = await db.query.ComplaintsTable.findMany();

  // Prescriptions
  const prescriptions = await db.query.PrescriptionsTable.findMany();

  return {
    patients: patients.length,
    doctors: doctors.length,
    appointments: appointments.length,
    revenue,
    complaints: complaints.length,
    prescriptions: prescriptions.length,
  };
};

// ✅ ================= ANALYTICS: GROUPED DATA =================

// 🔹 Appointments grouped by day
export const getAppointmentsPerDayService = async () => {
  return await db
    .select({
      day: sql`TO_CHAR(${AppointmentsTable.created_at}, 'YYYY-MM-DD')`.as("day"),
      count: sql`COUNT(*)`.as("count"),
    })
    .from(AppointmentsTable)
    .groupBy(sql`TO_CHAR(${AppointmentsTable.created_at}, 'YYYY-MM-DD')`)
    .orderBy(sql`TO_CHAR(${AppointmentsTable.created_at}, 'YYYY-MM-DD')`);
};

// 🔹 Patients grouped by month
export const getPatientsPerMonthService = async () => {
  return await db
    .select({
      month: sql`TO_CHAR(${UsersTable.created_at}, 'YYYY-MM')`.as("month"),
      count: sql`COUNT(*)`.as("count"),
    })
    .from(UsersTable)
    .where(eq(UsersTable.role, "user"))
    .groupBy(sql`TO_CHAR(${UsersTable.created_at}, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${UsersTable.created_at}, 'YYYY-MM')`);
};

// 🔹 Doctors grouped by month
export const getDoctorsPerMonthService = async () => {
  return await db
    .select({
      month: sql`TO_CHAR(${DoctorsTable.created_at}, 'YYYY-MM')`.as("month"),
      count: sql`COUNT(*)`.as("count"),
    })
    .from(DoctorsTable)
    .groupBy(sql`TO_CHAR(${DoctorsTable.created_at}, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${DoctorsTable.created_at}, 'YYYY-MM')`);
};

// 🔹 Payments grouped by month
export const getPaymentsPerMonthService = async () => {
  return await db
    .select({
      month: sql`TO_CHAR(${PaymentsTable.created_at}, 'YYYY-MM')`.as("month"),
      count: sql`COUNT(*)`.as("count"),
    })
    .from(PaymentsTable)
    .groupBy(sql`TO_CHAR(${PaymentsTable.created_at}, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${PaymentsTable.created_at}, 'YYYY-MM')`);
};

// 🔹 Complaints grouped by month
export const getComplaintsPerMonthService = async () => {
  return await db
    .select({
      month: sql`TO_CHAR(${ComplaintsTable.created_at}, 'YYYY-MM')`.as("month"),
      count: sql`COUNT(*)`.as("count"),
    })
    .from(ComplaintsTable)
    .groupBy(sql`TO_CHAR(${ComplaintsTable.created_at}, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${ComplaintsTable.created_at}, 'YYYY-MM')`);
};

// ✅ ================= OPTIONAL: COMBINED ANALYTICS =================
export const getAnalyticsService = async () => {
  const [appointmentsPerDay, patientsPerMonth, doctorsPerMonth, paymentsPerMonth, complaintsPerMonth] =
    await Promise.all([
      getAppointmentsPerDayService(),
      getPatientsPerMonthService(),
      getDoctorsPerMonthService(),
      getPaymentsPerMonthService(),
      getComplaintsPerMonthService(),
    ]);

  return {
    appointmentsPerDay,
    patientsPerMonth,
    doctorsPerMonth,
    paymentsPerMonth,
    complaintsPerMonth,
  };
};
