// src/payment/payment.router.ts

import { Express } from "express";
import {
  createPaymentController,
  getAllPaymentsController,
  getPaymentByIdController,
  updatePaymentController,
  deletePaymentController,
  getPaymentsByAppointmentController,
  getFullPaymentDetailsController,
} from "./payment.controller";

const PaymentRoutes = (app: Express) => {
  // Create a new payment
  app.route("/payments").post(async (req, res, next) => {
    try {
      await createPaymentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all payments
  app.route("/payments").get(async (req, res, next) => {
    try {
      await getAllPaymentsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get payment by ID
  app.route("/payments/:id").get(async (req, res, next) => {
    try {
      await getPaymentByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update payment by ID
  app.route("/payments/:id").put(async (req, res, next) => {
    try {
      await updatePaymentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete payment by ID
  app.route("/payments/:id").delete(async (req, res, next) => {
    try {
      await deletePaymentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get payments by appointment
  app.route("/payments/appointment/:appointmentID").get(async (req, res, next) => {
    try {
      await getPaymentsByAppointmentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get full payment details
  app.route("/payments/full/:id").get(async (req, res, next) => {
    try {
      await getFullPaymentDetailsController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default PaymentRoutes;
