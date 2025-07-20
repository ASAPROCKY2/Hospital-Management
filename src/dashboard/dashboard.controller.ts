// src/dashboard/dashboard.controller.ts
import { Request, Response } from "express";
import { getDashboardStatsService } from "./dashboard.service";

export const getDashboardStatsController = async (_req: Request, res: Response) => {
  try {
    const stats = await getDashboardStatsService();
    return res.status(200).json(stats);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
