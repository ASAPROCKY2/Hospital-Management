// src/doctor/doctor.router.ts
import { Express, Request, Response, NextFunction } from "express";
import {
  createDoctorController,
  getAllDoctorsController,
  getDoctorByIdController,
  updateDoctorController,
  deleteDoctorController,
  getDoctorWithAppointmentsController,
  getDoctorWithPrescriptionsController,
} from "./doctor.controller";

const DoctorRoutes = (app: Express) => {

  app.post("/doctor", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createDoctorController(req, res);
    } catch (error) {
      console.error("Error in POST /doctor:", error);
      next(error);
    }
  });

 
  app.get("/doctor", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllDoctorsController(req, res);
    } catch (error) {
      console.error("Error in GET /doctor:", error);
      next(error);
    }
  });

  app.get("/doctor/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getDoctorByIdController(req, res);
    } catch (error) {
      console.error(`Error in GET /doctor/${req.params.id}:`, error);
      next(error);
    }
  });

 
  app.put("/doctor/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateDoctorController(req, res);
    } catch (error) {
      console.error(`Error in PUT /doctor/${req.params.id}:`, error);
      next(error);
    }
  });

  
  app.delete("/doctor/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteDoctorController(req, res);
    } catch (error) {
      console.error(`Error in DELETE /doctor/${req.params.id}:`, error);
      next(error);
    }
  });

  
  app.get("/doctor/appointments/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getDoctorWithAppointmentsController(req, res);
    } catch (error) {
      console.error(`Error in GET /doctor/appointments/${req.params.id}:`, error);
      next(error);
    }
  });

  
  app.get("/doctor/prescriptions/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getDoctorWithPrescriptionsController(req, res);
    } catch (error) {
      console.error(`Error in GET /doctor/prescriptions/${req.params.id}:`, error);
      next(error);
    }
  });
};

export default DoctorRoutes;
