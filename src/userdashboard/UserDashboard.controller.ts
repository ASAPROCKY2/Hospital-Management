// src/dashboard/user-dashboard.controller.ts
import { Request, Response } from "express";
import { getUserDashboardStatsService } from "./UserDashboard.service";

export const getUserDashboardStatsController = async (req: Request, res: Response) => {
  try {
    // get the logged-in user's id from auth middleware
    const userId = (req as any).user?.user_id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no user id found." });
    }

    const stats = await getUserDashboardStatsService(userId);

    // Explicitly structure the response
    return res.status(200).json({
      appointments: stats.appointments,
      prescriptions: stats.prescriptions,
      complaints: stats.complaints,
      payments: stats.payments,
    });
  } catch (error: any) {
    console.error("Error fetching user dashboard stats:", error);
    return res.status(500).json({
      error: "Failed to fetch user dashboard stats",
      details: error?.message ?? "Unknown error",
    });
  }
};
