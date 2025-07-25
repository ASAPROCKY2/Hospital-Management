// src/dashboard/dashboard.routes.ts
import { Express, Request, Response, NextFunction } from "express";
import {
  getDashboardStatsController,
  getAppointmentsPerDayController,
  getPatientsPerMonthController,
  getDoctorsPerMonthController,
  getPaymentsPerMonthController,
  getComplaintsPerMonthController,
  getAnalyticsController,
} from "./dashboard.controller";

const DashboardRoutes = (app: Express) => {
  // ✅ Main dashboard stats (totals)
  app.get(
    "/admin/dashboard-stats",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await getDashboardStatsController(req, res);
      } catch (error) {
        console.error("Error in /admin/dashboard-stats route:", error);
        next(error);
      }
    }
  );

  // ✅ Analytics: Appointments per day
  app.get(
    "/admin/analytics/appointments-per-day",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await getAppointmentsPerDayController(req, res);
      } catch (error) {
        console.error("Error in /admin/analytics/appointments-per-day route:", error);
        next(error);
      }
    }
  );

  // ✅ Analytics: Patients per month
  app.get(
    "/admin/analytics/patients-per-month",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await getPatientsPerMonthController(req, res);
      } catch (error) {
        console.error("Error in /admin/analytics/patients-per-month route:", error);
        next(error);
      }
    }
  );

  // ✅ Analytics: Doctors per month
  app.get(
    "/admin/analytics/doctors-per-month",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await getDoctorsPerMonthController(req, res);
      } catch (error) {
        console.error("Error in /admin/analytics/doctors-per-month route:", error);
        next(error);
      }
    }
  );

  // ✅ Analytics: Payments per month
  app.get(
    "/admin/analytics/payments-per-month",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await getPaymentsPerMonthController(req, res);
      } catch (error) {
        console.error("Error in /admin/analytics/payments-per-month route:", error);
        next(error);
      }
    }
  );

  // ✅ Analytics: Complaints per month
  app.get(
    "/admin/analytics/complaints-per-month",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await getComplaintsPerMonthController(req, res);
      } catch (error) {
        console.error("Error in /admin/analytics/complaints-per-month route:", error);
        next(error);
      }
    }
  );

  // ✅ Combined analytics (fetch all analytics in one request)
  app.get(
    "/admin/analytics",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await getAnalyticsController(req, res);
      } catch (error) {
        console.error("Error in /admin/analytics route:", error);
        next(error);
      }
    }
  );
};

export default DashboardRoutes;
