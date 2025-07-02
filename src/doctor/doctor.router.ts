// src/doctor/doctor.router.ts

import { Express } from "express";
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
  // Create a new doctor
  app.route("/doctor").post(async (req, res, next) => {
    try {
      await createDoctorController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all doctors
  app.route("/doctor").get(async (req, res, next) => {
    try {
      await getAllDoctorsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get doctor by ID
  app.route("/doctor/:id").get(async (req, res, next) => {
    try {
      await getDoctorByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update doctor by ID
  app.route("/doctor/:id").put(async (req, res, next) => {
    try {
      await updateDoctorController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete doctor by ID
  app.route("/doctor/:id").delete(async (req, res, next) => {
    try {
      await deleteDoctorController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get doctor with appointments, patients, prescriptions, and payments
  app.route("/doctor/appointments/:id").get(async (req, res, next) => {
    try {
      await getDoctorWithAppointmentsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get doctor with prescriptions and linked appointments
  app.route("/doctor/prescriptions/:id").get(async (req, res, next) => {
    try {
      await getDoctorWithPrescriptionsController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default DoctorRoutes;
