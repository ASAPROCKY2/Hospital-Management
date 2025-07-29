import { Express } from "express";
import {
  createPaymentController,
  getAllPaymentsController,
  getPaymentByIdController,
  updatePaymentController,
  deletePaymentController,
  getPaymentsByAppointmentController,
  getFullPaymentDetailsController,
  initiatePaymentController,
  handlePaymentCallbackController,
} from "./payment.controller";

import {
  isAuthenticated,
  adminRoleAuth,
  bothRoleAuth,
} from "../middleware/bearAuth";

const PaymentRoutes = (app: Express) => {
  // Create a payment
  app.post(
    "/payments",
    isAuthenticated,
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await createPaymentController(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // Get all payments
  app.get("/payments", async (req, res, next) => {
    try {
      await getAllPaymentsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get payment by ID
  app.get("/payments/:id", async (req, res, next) => {
    try {
      await getPaymentByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update payment
  app.put(
    "/payments/:id",
    isAuthenticated,
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await updatePaymentController(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // Delete payment
  app.delete(
    "/payments/:id",
    isAuthenticated,
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await deletePaymentController(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // Get payments by appointment
  app.get("/payments/appointment/:appointmentID", async (req, res, next) => {
    try {
      await getPaymentsByAppointmentController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get full payment details (with joins)
  app.get(
    "/payments/full/:id",
    isAuthenticated,
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await getFullPaymentDetailsController(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // Initiate STK push payment
  app.post("/payments/initiate", async (req, res, next) => {
    try {
      await initiatePaymentController(req, res);
    } catch (error) {
      next(error);
    }
  });

 
  app.post("/payments/payment-callback", async (req, res, next) => {
    try {
      await handlePaymentCallbackController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default PaymentRoutes;
