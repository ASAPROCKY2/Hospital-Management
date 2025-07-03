// src/prescription/prescription.router.ts

import { Express } from "express";
import {
  createPrescriptionController,
  getAllPrescriptionsController,
  getPrescriptionByIdController,
  updatePrescriptionController,
  deletePrescriptionController,
  getPrescriptionsByDoctorController,
  getPrescriptionsByPatientController,
  getFullPrescriptionDetailsController,
} from "./prescription.controller";

const PrescriptionRoutes = (app: Express) => {
  // Create a new prescription
  app.route("/prescriptions").post(async (req, res, next) => {
    try {
      await createPrescriptionController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all prescriptions
  app.route("/prescriptions").get(async (req, res, next) => {
    try {
      await getAllPrescriptionsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get prescription by ID
  app.route("/prescriptions/:id").get(async (req, res, next) => {
    try {
      await getPrescriptionByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update prescription by ID
  app.route("/prescriptions/:id").put(async (req, res, next) => {
    try {
      await updatePrescriptionController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete prescription by ID
  app.route("/prescriptions/:id").delete(async (req, res, next) => {
    try {
      await deletePrescriptionController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get prescriptions by doctor
  app.route("/prescriptions/doctor/:doctorID").get(async (req, res, next) => {
    try {
      await getPrescriptionsByDoctorController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get prescriptions by patient
  app.route("/prescriptions/patient/:userID").get(async (req, res, next) => {
    try {
      await getPrescriptionsByPatientController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get full prescription details
  app.route("/prescriptions/full/:id").get(async (req, res, next) => {
    try {
      await getFullPrescriptionDetailsController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default PrescriptionRoutes;
