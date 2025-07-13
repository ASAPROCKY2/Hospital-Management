import request from "supertest";
import express from "express";
import * as AppointmentService from "../../src/appointment/appointment.service";
import {
  createAppointmentController,
  getAllAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentController,
  deleteAppointmentController,
  getAppointmentsByDoctorController,
  getAppointmentsByUserController
} from "../../src/appointment/appointment.controller";

// Step 1: Set up minimal Express app
const app = express();
app.use(express.json());
app.post("/appointments", createAppointmentController as any);
app.get("/appointments", getAllAppointmentsController as any);
app.get("/appointments/:id", getAppointmentByIdController as any);
app.put("/appointments/:id", updateAppointmentController as any);
app.delete("/appointments/:id", deleteAppointmentController as any);
app.get("/appointments/doctor/:id", getAppointmentsByDoctorController as any);
app.get("/appointments/user/:id", getAppointmentsByUserController as any);

// Step 2: Mock the appointment service
jest.mock("../../src/appointment/appointment.service");

describe("Appointment Controller", () => {
  // Test: Create appointment
  test("POST /appointments should create a new appointment", async () => {
    const newAppointment = {
      userId: 1,
      doctorId: 2,
      appointmentDate: "2025-07-15",
      timeSlot: "10:00",
      totalAmount: 100.0,
      appointmentStatus: "Pending"
    };

    (AppointmentService.createAppointmentService as jest.Mock).mockResolvedValue("Appointment created successfully");

    const res = await request(app).post("/appointments").send(newAppointment);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "Appointment created successfully" });
  });

  // Test: Get all appointments
  test("GET /appointments should return all appointments", async () => {
    (AppointmentService.getAllAppointmentsService as jest.Mock).mockResolvedValue([
      { appointmentId: 1, doctorId: 2, userId: 1 }
    ]);

    const res = await request(app).get("/appointments");
    expect(res.status).toBe(200);
  });

  // Test: Get appointment by ID
  test("GET /appointments/:id should return an appointment", async () => {
    (AppointmentService.getAppointmentByIdService as jest.Mock).mockResolvedValue({
      appointmentId: 1,
      doctorId: 2,
      userId: 1
    });

    const res = await request(app).get("/appointments/1");
    expect(res.status).toBe(200);
  });

  // Test: Get appointment by invalid ID
  test("GET /appointments/:id with invalid ID should return 400", async () => {
    const res = await request(app).get("/appointments/invalid");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Invalid appointment ID" });
  });

  // Test: Get appointment by ID not found
  test("GET /appointments/:id should return 404 if not found", async () => {
    (AppointmentService.getAppointmentByIdService as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get("/appointments/999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Appointment not found" });
  });

  // Test: Update appointment
  test("PUT /appointments/:id should update an appointment", async () => {
    (AppointmentService.updateAppointmentService as jest.Mock).mockResolvedValue("Appointment updated successfully");

    const res = await request(app).put("/appointments/1").send({
      appointmentStatus: "Confirmed"
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Appointment updated successfully" });
  });

  // Test: Invalid appointment ID on update
  test("PUT /appointments/:id with invalid ID should return 400", async () => {
    const res = await request(app).put("/appointments/abc").send({ appointmentStatus: "Cancelled" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Invalid appointment ID" });
  });

  // Test: Delete appointment
  test("DELETE /appointments/:id should delete appointment", async () => {
    (AppointmentService.deleteAppointmentService as jest.Mock).mockResolvedValue("Appointment deleted successfully");

    const res = await request(app).delete("/appointments/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Appointment deleted successfully" });
  });

  // Test: Invalid ID on delete
  test("DELETE /appointments/:id with invalid ID should return 400", async () => {
    const res = await request(app).delete("/appointments/wrong");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Invalid appointment ID" });
  });

  // Test: Get by doctor ID
  test("GET /appointments/doctor/:id should return appointments by doctor", async () => {
    (AppointmentService.getAppointmentsByDoctorService as jest.Mock).mockResolvedValue([
      { appointmentId: 1, doctorId: 2 }
    ]);

    const res = await request(app).get("/appointments/doctor/2");
    expect(res.status).toBe(200);
  });

  // Test: Invalid doctor ID
  test("GET /appointments/doctor/:id with invalid ID should return 400", async () => {
    const res = await request(app).get("/appointments/doctor/abc");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Invalid doctor ID" });
  });

  // Test: Get by user ID
  test("GET /appointments/user/:id should return appointments by user", async () => {
    (AppointmentService.getAppointmentsByUserService as jest.Mock).mockResolvedValue([
      { appointmentId: 1, userId: 1 }
    ]);

    const res = await request(app).get("/appointments/user/1");
    expect(res.status).toBe(200);
  });

  // Test: Invalid user ID
  test("GET /appointments/user/:id with invalid ID should return 400", async () => {
    const res = await request(app).get("/appointments/user/abc");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Invalid user ID" });
  });

  // Negative test: Internal server errors
  test("Handles internal errors gracefully", async () => {
    (AppointmentService.getAllAppointmentsService as jest.Mock).mockRejectedValue(new Error("DB error"));
    const all = await request(app).get("/appointments");
    expect(all.status).toBe(500);

    (AppointmentService.getAppointmentByIdService as jest.Mock).mockRejectedValue(new Error("DB error"));
    const one = await request(app).get("/appointments/1");
    expect(one.status).toBe(500);

    (AppointmentService.createAppointmentService as jest.Mock).mockRejectedValue(new Error("DB error"));
    const create = await request(app).post("/appointments").send({});
    expect(create.status).toBe(500);

    (AppointmentService.updateAppointmentService as jest.Mock).mockRejectedValue(new Error("DB error"));
    const update = await request(app).put("/appointments/1").send({});
    expect(update.status).toBe(500);

    (AppointmentService.deleteAppointmentService as jest.Mock).mockRejectedValue(new Error("DB error"));
    const del = await request(app).delete("/appointments/1");
    expect(del.status).toBe(500);

    (AppointmentService.getAppointmentsByDoctorService as jest.Mock).mockRejectedValue(new Error("DB error"));
    const doc = await request(app).get("/appointments/doctor/1");
    expect(doc.status).toBe(500);

    (AppointmentService.getAppointmentsByUserService as jest.Mock).mockRejectedValue(new Error("DB error"));
    const user = await request(app).get("/appointments/user/1");
    expect(user.status).toBe(500);
  });
});

// Close database connection
import { client } from "../../src/Drizzle/db";
afterAll(async () => {
  await client.end();
});
