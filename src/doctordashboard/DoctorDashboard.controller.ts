// src/dashboard/doctor-dashboard.controller.ts
import { Request, Response } from "express";
import { getDoctorDashboardStatsService } from "./DoctorDashboard.service";
import db from "../Drizzle/db";
import { DoctorsTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";

export const getDoctorDashboardStatsController = async (req: Request, res: Response) => {
  try {
    // Get the logged-in user's info from auth middleware
    const authUser = (req as any).user;
    console.log("Decoded user payload:", authUser);

    // Your auth middleware likely sets user_id, not doctor_id
    const userId = authUser?.user_id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no user ID found." });
    }

    // Look up the doctor_id for this user from DoctorsTable
    const doctorRecord = await db.query.DoctorsTable.findFirst({
      where: eq(DoctorsTable.user_id, userId),
    });

    if (!doctorRecord) {
      return res.status(404).json({ message: "Doctor record not found for this user." });
    }

    const stats = await getDoctorDashboardStatsService(doctorRecord.doctor_id);

    return res.status(200).json({
      appointments: stats.appointments,
      prescriptions: stats.prescriptions,
      complaints: stats.complaints,
    });
  } catch (error: any) {
    console.error("Error fetching doctor dashboard stats:", error);
    return res.status(500).json({
      error: "Failed to fetch doctor dashboard stats",
      details: error?.message ?? "Unknown error",
    });
  }
};
