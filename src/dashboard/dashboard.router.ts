// src/dashboard/dashboard.routes.ts
import { Express, Request, Response, NextFunction } from "express";
import { getDashboardStatsController } from "./dashboard.controller";

const DashboardRoutes = (app: Express) => {
  // Route for fetching dashboard statistics
  app.get("/admin/dashboard-stats", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getDashboardStatsController(req, res);
    } catch (error) {
      console.error("Error in dashboard route:", error);
      next(error);
    }
  });
};

export default DashboardRoutes;
