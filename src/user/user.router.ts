import { Express } from "express";
import {
  createUserController,
  verifyUserController,
  userLoginController,
  getUsersController,
  getUserByIdController,
  updateUserController, // ✅ import update controller
  deleteUserByIdController,
  getUserWithAppointmentsController,
  getUserWithPrescriptionsController,
  getUserWithComplaintsController,
  getUserWithPaymentsController,
  getAllComplaintsWithDetailsController
} from "./user.controller";

const UserRoutes = (app: Express) => {
  // Register a new user
  app.route("/auth/register").post(async (req, res, next) => {
    try {
      await createUserController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Login
  app.route("/auth/login").post(async (req, res, next) => {
    try {
      await userLoginController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Verify user
  app.route("/auth/verify").post(async (req, res, next) => {
    try {
      await verifyUserController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all users
  app.route("/users").get(async (req, res, next) => {
    try {
      await getUsersController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get user by ID
  app.route("/users/:id").get(async (req, res, next) => {
    try {
      await getUserByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // ✅ Update user by ID
  app.route("/users/:id").put(async (req, res, next) => {
    try {
      await updateUserController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete user by ID
  app.route("/users/:id").delete(async (req, res, next) => {
    try {
      await deleteUserByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get user with appointments (includes doctor, payments, prescriptions)
  app.route("/users/:id/appointments").get(async (req, res, next) => {
    try {
      await getUserWithAppointmentsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get user with prescriptions
  app.route("/users/:id/prescriptions").get(async (req, res, next) => {
    try {
      await getUserWithPrescriptionsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get user with complaints
  app.route("/users/:id/complaints").get(async (req, res, next) => {
    try {
      await getUserWithComplaintsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get user with payments
  app.route("/users/:id/payments").get(async (req, res, next) => {
    try {
      await getUserWithPaymentsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Admin route: Get all complaints with user and doctor details
  app.route("/admin/complaints").get(async (req, res, next) => {
    try {
      await getAllComplaintsWithDetailsController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default UserRoutes;
