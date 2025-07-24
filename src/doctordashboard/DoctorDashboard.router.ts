// src/dashboard/doctor-dashboard.routes.ts
import { Express, Request, Response, NextFunction } from "express";
import { getDoctorDashboardStatsController } from "./DoctorDashboard.controller";
import { isAuthenticated, doctorRoleAuth } from "../middleware/bearAuth";


const DoctorDashboardRoutes = (app: Express) => {
  app.get(
    "/doctor/dashboard-stats",
    isAuthenticated,    // verify JWT/session
    doctorRoleAuth,     // ensure the user has a doctor role
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await getDoctorDashboardStatsController(req, res);
      } catch (error) {
        console.error("Error in doctor dashboard route:", error);
        next(error);
      }
    }
  );
};

export default DoctorDashboardRoutes;
