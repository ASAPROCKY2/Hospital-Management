// src/dashboard/dashboard.controller.ts
import { Request, Response } from "express";
import { getDashboardStatsService } from "./dashboard.service";

export const getDashboardStatsController = async (_req: Request, res: Response) => {
  try {
    const stats = await getDashboardStatsService();

    // Explicitly structure the response so you know exactly what’s being sent
    return res.status(200).json({
      patients: stats.patients,
      doctors: stats.doctors,
      appointments: stats.appointments,
      revenue: stats.revenue,
      complaints: stats.complaints,
      prescriptions: stats.prescriptions,
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({
      error: "Failed to fetch dashboard stats",
      details: error?.message ?? "Unknown error",
    });
  }
};
