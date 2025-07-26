import { Express } from "express";
import {
  createPaymentController,
  getAllPaymentsController,
  getPaymentByIdController,
  updatePaymentController,
  deletePaymentController,
  getPaymentsByAppointmentController,
  getFullPaymentDetailsController,
  initiatePaymentController
} from "./payment.controller";

import {
  isAuthenticated,
  adminRoleAuth,
  bothRoleAuth,
} from "../middleware/bearAuth";

const PaymentRoutes = (app: Express) => {
  // ✅ Create a new payment (admin only in this example)
  app.route("/payments").post(
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

  // ✅ Get all payments (admin only)
  app.route("/payments").get(
    isAuthenticated,
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await getAllPaymentsController(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // ✅ Get payment by ID (admin or patient)
  app.route("/payments/:id").get(
    isAuthenticated,
    bothRoleAuth,
    async (req, res, next) => {
      try {
        await getPaymentByIdController(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // ✅ Update payment by ID (admin only)
  app.route("/payments/:id").put(
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

  // ✅ Delete payment by ID (admin only)
  app.route("/payments/:id").delete(
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

  // ✅ Get payments by appointment (admin or patient)
  app.route("/payments/appointment/:appointmentID").get(
    isAuthenticated,
    bothRoleAuth,
    async (req, res, next) => {
      try {
        await getPaymentsByAppointmentController(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // ✅ Get full payment details (admin only)
  app.route("/payments/full/:id").get(
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

  // ✅ Initiate M-Pesa STK Push (patient or admin can trigger)
  app.route("/payments/initiate").post(
    isAuthenticated,
    bothRoleAuth, // allow both patients and admins
    async (req, res, next) => {
      try {
        await initiatePaymentController(req, res);
      } catch (error) {
        next(error);
      }
    }
  );
};

export default PaymentRoutes;
