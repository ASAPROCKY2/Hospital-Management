import request from "supertest";
import express from "express";
import * as UserService from "../../src/user/user.service";
import {
  createUserController,
  userLoginController,
  verifyUserController,
  getUsersController,
  getUserByIdController,
  deleteUserByIdController,
  getUserWithAppointmentsController,
  getUserWithPrescriptionsController,
  getUserWithComplaintsController,
  getUserWithPaymentsController,
  getAllComplaintsWithDetailsController,
} from "../../src/user/user.controller";

// Setup Express app
const app = express();
app.use(express.json());

app.post("/users", createUserController as any);
app.post("/users/login", userLoginController as any);
app.post("/users/verify", verifyUserController as any);
app.get("/users", getUsersController as any);
app.get("/users/:id", getUserByIdController as any);
app.delete("/users/:id", deleteUserByIdController as any);
app.get("/users/:id/appointments", getUserWithAppointmentsController as any);
app.get("/users/:id/prescriptions", getUserWithPrescriptionsController as any);
app.get("/users/:id/complaints", getUserWithComplaintsController as any);
app.get("/users/:id/payments", getUserWithPaymentsController as any);
app.get("/admin/complaints/full", getAllComplaintsWithDetailsController as any);

// Mock the service
jest.mock("../../src/user/user.service");

describe("User Controller Integration Tests", () => {
  test("POST /users should register a user successfully", async () => {
    (UserService.createUserService as jest.Mock).mockResolvedValue("User created");

    const res = await request(app).post("/users").send({
      firstName: "Emily",
      lastName: "Ngugi",
      email: "emily.ngugi@example.com",
      password: "password123",
      contactPhone: "0712345678",
      address: "Westlands, Nairobi",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/user created/i);
  });

 

  test("POST /users/login should authenticate user", async () => {
    (UserService.userLoginService as jest.Mock).mockResolvedValue({
      user_id: 1,
      email: "test@example.com",
      password: await require("bcryptjs").hash("secret", 10),
      firstname: "Test",
      lastname: "User",
      role: "customer",
    });

    const res = await request(app).post("/users/login").send({
      email: "test@example.com",
      password: "secret",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
  });

  test("POST /users/login fails with wrong password", async () => {
    (UserService.userLoginService as jest.Mock).mockResolvedValue({
      user_id: 1,
      email: "test@example.com",
      password: await require("bcryptjs").hash("correctpassword", 10),
    });

    const res = await request(app).post("/users/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  test("POST /users/login fails if user not found", async () => {
    (UserService.userLoginService as jest.Mock).mockResolvedValue(null);

    const res = await request(app).post("/users/login").send({
      email: "missing@example.com",
      password: "doesntmatter",
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/user not found/i);
  });

  test("POST /users/verify should verify user", async () => {
    (UserService.verifyUserService as jest.Mock).mockResolvedValue("verified");

    const res = await request(app).post("/users/verify").send({ email: "verify@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/verified/i);
  });

  test("GET /users should return all users", async () => {
    (UserService.getUsersService as jest.Mock).mockResolvedValue([{ user_id: 1, email: "a@b.com" }]);

    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /users/:id should return user", async () => {
    (UserService.getUserByIdService as jest.Mock).mockResolvedValue({ user_id: 1 });

    const res = await request(app).get("/users/1");
    expect(res.status).toBe(200);
    expect(res.body.data.user_id).toBe(1);
  });

  test("DELETE /users/:id should delete user", async () => {
    (UserService.deleteUserService as jest.Mock).mockResolvedValue("deleted");

    const res = await request(app).delete("/users/1");
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test("GET /users/:id/appointments should return appointments", async () => {
    (UserService.getUserWithAppointments as jest.Mock).mockResolvedValue([{ id: 1 }]);

    const res = await request(app).get("/users/1/appointments");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /users/:id/prescriptions should return prescriptions", async () => {
    (UserService.getUserWithPrescriptions as jest.Mock).mockResolvedValue([{ id: 1 }]);

    const res = await request(app).get("/users/1/prescriptions");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /users/:id/complaints should return complaints", async () => {
    (UserService.getUserWithComplaints as jest.Mock).mockResolvedValue([{ id: 1 }]);

    const res = await request(app).get("/users/1/complaints");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /users/:id/payments should return payments", async () => {
    (UserService.getUserWithPayments as jest.Mock).mockResolvedValue([{ id: 1 }]);

    const res = await request(app).get("/users/1/payments");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /admin/complaints/full should return all complaint details", async () => {
    (UserService.getAllComplaintsWithDetails as jest.Mock).mockResolvedValue([{ id: 1 }]);

    const res = await request(app).get("/admin/complaints/full");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("Handles internal server errors", async () => {
    (UserService.getUsersService as jest.Mock).mockRejectedValue(new Error("fail"));
    const res = await request(app).get("/users");
    expect(res.status).toBe(500);
  });
});

// Cleanup DB
import { client } from "../../src/Drizzle/db";
afterAll(async () => {
  await client.end();
});
