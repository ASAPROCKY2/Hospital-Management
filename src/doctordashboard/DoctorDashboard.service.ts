// src/dashboard/doctor-dashboard.service.ts
import db from "../Drizzle/db";
import {
  AppointmentsTable,
  ComplaintsTable,
  PrescriptionsTable,
} from "../Drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Fetch stats for a specific doctor
 * @param doctorId - the doctor_id from DoctorsTable
 */
export const getDoctorDashboardStatsService = async (doctorId: number) => {
  // Appointments handled by this doctor
  const appointments = await db.query.AppointmentsTable.findMany({
    where: eq(AppointmentsTable.doctor_id, doctorId),
  });

  // Prescriptions issued by this doctor
  const prescriptions = await db.query.PrescriptionsTable.findMany({
    where: eq(PrescriptionsTable.doctor_id, doctorId),
  });

  // Complaints linked to this doctor (only if column exists)
  let complaintsCount = 0;
  try {
    const complaints = await db.query.ComplaintsTable.findMany({
      where: eq(ComplaintsTable.doctor_id, doctorId),
    });
    complaintsCount = complaints.length;
  } catch (err) {
    // If ComplaintsTable doesn’t have doctor_id, complaintsCount stays 0
    console.warn("Complaints lookup skipped or failed:", err);
  }

  return {
    appointments: appointments.length,
    prescriptions: prescriptions.length,
    complaints: complaintsCount,
  };
};
