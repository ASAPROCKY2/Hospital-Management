import request from "supertest";
import express from "express";
import * as UserService from "../../src/user/user.service";
import * as Mailer from "../../src/Mailer/mailer";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
  getAllComplaintsWithDetailsController
} from "../../src/user/user.controller";

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

jest.mock("../../src/user/user.service");
jest.mock("../../src/Mailer/mailer");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User Controller Integration Tests", () => {
  const mockUser = {
    user_id: 1,
    firstname: "Jane",
    lastname: "Doe",
    email: "jane@example.com",
    password: "hashedpass",
    role: "customer",
  };

  test("POST /users should register a user successfully", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpass");
    (UserService.createUserService as jest.Mock).mockResolvedValue(undefined);
    (Mailer.sendEmail as jest.Mock).mockResolvedValue("Email sent successfully");

    const res = await request(app).post("/users").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "pass1234",
      role: "customer"
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/verification code sent/i);
  });

  test("POST /users should fail if user creation throws", async () => {
    const spy = jest.spyOn(UserService, "createUserService").mockImplementation(() => {
      throw new Error("Email already in use");
    });

    const res = await request(app).post("/users").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "duplicate@example.com",
      password: "pass1234",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/email already in use/i);
    spy.mockRestore();
  });

  test("POST /users/login should authenticate user", async () => {
    (UserService.userLoginService as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("token123");

    const res = await request(app).post("/users/login").send({
      email: mockUser.email,
      password: "pass1234"
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe("token123");
  });

  test("POST /users/login fails with wrong password", async () => {
    (UserService.userLoginService as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const res = await request(app).post("/users/login").send({
      email: mockUser.email,
      password: "wrongpass"
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  test("POST /users/login fails if user not found", async () => {
    (UserService.userLoginService as jest.Mock).mockResolvedValue(null);

    const res = await request(app).post("/users/login").send({
      email: "notfound@example.com",
      password: "pass1234"
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/user not found/i);
  });

  test("POST /users/verify should verify user", async () => {
    (UserService.verifyUserService as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app).post("/users/verify").send({ email: mockUser.email });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User verified successfully");
  });

  test("GET /users should return all users", async () => {
    (UserService.getUsersService as jest.Mock).mockResolvedValue([mockUser]);

    const res = await request(app).get("/users");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  test("GET /users/:id should return user", async () => {
    (UserService.getUserByIdService as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app).get("/users/1");

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(mockUser.email);
  });

  test("DELETE /users/:id should delete user", async () => {
    (UserService.deleteUserService as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app).delete("/users/1");

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test("GET /users/:id/appointments should return appointments", async () => {
    (UserService.getUserWithAppointments as jest.Mock).mockResolvedValue({ appointments: [] });

    const res = await request(app).get("/users/1/appointments");
    expect(res.status).toBe(200);
  });

  test("GET /users/:id/prescriptions should return prescriptions", async () => {
    (UserService.getUserWithPrescriptions as jest.Mock).mockResolvedValue({ prescriptions: [] });

    const res = await request(app).get("/users/1/prescriptions");
    expect(res.status).toBe(200);
  });

  test("GET /users/:id/complaints should return complaints", async () => {
    (UserService.getUserWithComplaints as jest.Mock).mockResolvedValue({ complaints: [] });

    const res = await request(app).get("/users/1/complaints");
    expect(res.status).toBe(200);
  });

  test("GET /users/:id/payments should return payments", async () => {
    (UserService.getUserWithPayments as jest.Mock).mockResolvedValue({ payments: [] });

    const res = await request(app).get("/users/1/payments");
    expect(res.status).toBe(200);
  });

  test("GET /admin/complaints/full should return all complaint details", async () => {
    (UserService.getAllComplaintsWithDetails as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get("/admin/complaints/full");
    expect(res.status).toBe(200);
  });
});

import { client } from "../../src/Drizzle/db";
afterAll(async () => {
  jest.clearAllMocks();
  await client.end();
});
