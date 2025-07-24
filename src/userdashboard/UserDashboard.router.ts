// src/dashboard/user-dashboard.routes.ts
import { Express, Request, Response, NextFunction } from "express";
import { getUserDashboardStatsController } from "./UserDashboard.controller";
import { isAuthenticated, patientRoleAuth } from "../middleware/bearAuth"; 

const UserDashboardRoutes = (app: Express) => {
 
  app.get(
    "/user/dashboard-stats",
    isAuthenticated,      
    patientRoleAuth,      
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await getUserDashboardStatsController(req, res);
      } catch (error) {
        console.error("Error in user dashboard route:", error);
        next(error);
      }
    }
  );
};

export default UserDashboardRoutes;
