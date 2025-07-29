import { Express } from "express";
import {
  createAppointmentController,
  getAllAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentController,
  deleteAppointmentController,
  getAppointmentsByDoctorController,
  getAppointmentsByUserController,
} from "./appointment.controller";

const AppointmentRoutes = (app: Express) => {
  // Create a new appointment
  app.route("/appointment").post(async (req, res, next) => {
    try {
      await createAppointmentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all appointments
  app.route("/appointment").get(async (req, res, next) => {
    try {
      await getAllAppointmentsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get appointment by ID
  app.route("/appointment/:id").get(async (req, res, next) => {
    try {
      await getAppointmentByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update appointment by ID
  app.route("/appointment/:id").put(async (req, res, next) => {
    try {
      await updateAppointmentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete appointment by ID
  app.route("/appointment/:id").delete(async (req, res, next) => {
    try {
      await deleteAppointmentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get appointments by doctor ID
  app.route("/appointment/doctor/:id").get(async (req, res, next) => {
    try {
      await getAppointmentsByDoctorController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get appointments by user ID
  app.route("/appointment/user/:id").get(async (req, res, next) => {
    try {
      await getAppointmentsByUserController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default AppointmentRoutes;
