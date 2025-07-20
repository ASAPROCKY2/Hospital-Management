// src/dashboard/dashboard.routes.ts
import { Express } from "express";
import { getDashboardStatsController } from "./dashboard.controller";

const DashboardRoutes = (app: Express) => {
  app.get("/admin/dashboard-stats", async (req, res, next) => {
    try {
      await getDashboardStatsController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default DashboardRoutes;
