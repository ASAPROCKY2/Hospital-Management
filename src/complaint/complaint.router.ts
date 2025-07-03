// src/complaint/complaint.router.ts

import { Express } from "express";
import {
  createComplaintController,
  getAllComplaintsController,
  getComplaintByIdController,
  updateComplaintController,
  deleteComplaintController,
  getComplaintsByUserController,
  getComplaintsByDoctorController,
  getFullComplaintDetailsController,
} from "./complaint.controller";

const ComplaintRoutes = (app: Express) => {
  // Create a new complaint
  app.route("/complaint").post(async (req, res, next) => {
    try {
      await createComplaintController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all complaints
  app.route("/complaint").get(async (req, res, next) => {
    try {
      await getAllComplaintsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get complaint by ID
  app.route("/complaint/:id").get(async (req, res, next) => {
    try {
      await getComplaintByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update complaint by ID
  app.route("/complaint/:id").put(async (req, res, next) => {
    try {
      await updateComplaintController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete complaint by ID
  app.route("/complaint/:id").delete(async (req, res, next) => {
    try {
      await deleteComplaintController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get complaints by user ID
  app.route("/complaint/user/:userID").get(async (req, res, next) => {
    try {
      await getComplaintsByUserController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get complaints against a doctor ID
  app.route("/complaint/doctor/:doctorID").get(async (req, res, next) => {
    try {
      await getComplaintsByDoctorController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get full complaint details
  app.route("/complaint/full/:id").get(async (req, res, next) => {
    try {
      await getFullComplaintDetailsController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default ComplaintRoutes;
