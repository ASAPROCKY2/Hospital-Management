// src/dashboard/dashboard.controller.ts
import { Request, Response } from "express";
import {
  getDashboardStatsService,
  getAppointmentsPerDayService,
  getPatientsPerMonthService,
  getDoctorsPerMonthService,
  getPaymentsPerMonthService,
  getComplaintsPerMonthService,
  getAnalyticsService,
} from "./dashboard.service";

// ✅ Main dashboard stats (totals)
export const getDashboardStatsController = async (_req: Request, res: Response) => {
  try {
    const stats = await getDashboardStatsService();

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

// ✅ Appointments grouped by day
export const getAppointmentsPerDayController = async (_req: Request, res: Response) => {
  try {
    const data = await getAppointmentsPerDayService();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error fetching appointments per day:", error);
    return res.status(500).json({
      error: "Failed to fetch appointments per day",
      details: error?.message ?? "Unknown error",
    });
  }
};

// ✅ Patients grouped by month
export const getPatientsPerMonthController = async (_req: Request, res: Response) => {
  try {
    const data = await getPatientsPerMonthService();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error fetching patients per month:", error);
    return res.status(500).json({
      error: "Failed to fetch patients per month",
      details: error?.message ?? "Unknown error",
    });
  }
};

// ✅ Doctors grouped by month
export const getDoctorsPerMonthController = async (_req: Request, res: Response) => {
  try {
    const data = await getDoctorsPerMonthService();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error fetching doctors per month:", error);
    return res.status(500).json({
      error: "Failed to fetch doctors per month",
      details: error?.message ?? "Unknown error",
    });
  }
};

// ✅ Payments grouped by month
export const getPaymentsPerMonthController = async (_req: Request, res: Response) => {
  try {
    const data = await getPaymentsPerMonthService();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error fetching payments per month:", error);
    return res.status(500).json({
      error: "Failed to fetch payments per month",
      details: error?.message ?? "Unknown error",
    });
  }
};

// ✅ Complaints grouped by month
export const getComplaintsPerMonthController = async (_req: Request, res: Response) => {
  try {
    const data = await getComplaintsPerMonthService();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error fetching complaints per month:", error);
    return res.status(500).json({
      error: "Failed to fetch complaints per month",
      details: error?.message ?? "Unknown error",
    });
  }
};

// ✅ Combined analytics (all at once)
export const getAnalyticsController = async (_req: Request, res: Response) => {
  try {
    const data = await getAnalyticsService();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error fetching combined analytics:", error);
    return res.status(500).json({
      error: "Failed to fetch combined analytics",
      details: error?.message ?? "Unknown error",
    });
  }
};
