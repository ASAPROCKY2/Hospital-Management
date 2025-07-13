import request from "supertest";
import express from "express";
import * as PrescriptionService from "../../src/prescription/prescription.service";
import {
  createPrescriptionController,
  getAllPrescriptionsController,
  getPrescriptionByIdController,
  updatePrescriptionController,
  deletePrescriptionController,
  getPrescriptionsByDoctorController,
  getPrescriptionsByPatientController,
  getFullPrescriptionDetailsController,
} from "../../src/prescription/prescription.controller";

// Step 1: Setup express app
const app = express();
app.use(express.json());

app.post("/prescriptions", createPrescriptionController as any);
app.get("/prescriptions", getAllPrescriptionsController as any);
app.get("/prescriptions/:id", getPrescriptionByIdController as any);
app.put("/prescriptions/:id", updatePrescriptionController as any);
app.delete("/prescriptions/:id", deletePrescriptionController as any);
app.get("/doctors/:doctorID/prescriptions", getPrescriptionsByDoctorController as any);
app.get("/patients/:userID/prescriptions", getPrescriptionsByPatientController as any);
app.get("/prescriptions/full/:id", getFullPrescriptionDetailsController as any);

// Step 2: Mock the service
jest.mock("../../src/prescription/prescription.service");

describe("Prescription Controller", () => {
  // CREATE
  test("POST /prescriptions should create a prescription", async () => {
    (PrescriptionService.createPrescriptionService as jest.Mock).mockResolvedValue("Prescription created");

    const res = await request(app).post("/prescriptions").send({
      appointmentId: 1,
      doctorId: 2,
      patientId: 3,
      notes: "Take medication twice daily",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "Prescription created" });
  });

  // READ ALL
  test("GET /prescriptions should return all prescriptions", async () => {
    (PrescriptionService.getAllPrescriptionsService as jest.Mock).mockResolvedValue([
      { prescriptionId: 1, notes: "Test note" },
    ]);

    const res = await request(app).get("/prescriptions");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // READ BY ID
  test("GET /prescriptions/:id should return a prescription", async () => {
    (PrescriptionService.getPrescriptionByIdService as jest.Mock).mockResolvedValue({
      prescriptionId: 1,
      notes: "Take daily",
    });

    const res = await request(app).get("/prescriptions/1");

    expect(res.status).toBe(200);
    expect(res.body.prescriptionId).toBe(1);
  });

  // NOT FOUND
  test("GET /prescriptions/:id returns 404 if not found", async () => {
    (PrescriptionService.getPrescriptionByIdService as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/prescriptions/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Prescription not found" });
  });

  // UPDATE
  test("PUT /prescriptions/:id should update a prescription", async () => {
    (PrescriptionService.updatePrescriptionService as jest.Mock).mockResolvedValue("Prescription updated");

    const res = await request(app).put("/prescriptions/1").send({ notes: "Updated notes" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Prescription updated" });
  });

  // DELETE
  test("DELETE /prescriptions/:id should delete a prescription", async () => {
    (PrescriptionService.deletePrescriptionService as jest.Mock).mockResolvedValue("Prescription deleted");

    const res = await request(app).delete("/prescriptions/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Prescription deleted" });
  });

  // GET BY DOCTOR
  test("GET /doctors/:doctorID/prescriptions returns prescriptions", async () => {
    (PrescriptionService.getPrescriptionsByDoctorService as jest.Mock).mockResolvedValue([
      { prescriptionId: 1, doctorId: 2 },
    ]);

    const res = await request(app).get("/doctors/2/prescriptions");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // GET BY PATIENT
  test("GET /patients/:userID/prescriptions returns prescriptions", async () => {
    (PrescriptionService.getPrescriptionsByPatientService as jest.Mock).mockResolvedValue([
      { prescriptionId: 1, patientId: 3 },
    ]);

    const res = await request(app).get("/patients/3/prescriptions");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // FULL DETAILS
  test("GET /prescriptions/full/:id returns full details", async () => {
    (PrescriptionService.getFullPrescriptionDetailsService as jest.Mock).mockResolvedValue({
      prescriptionId: 1,
      notes: "Complete info",
    });

    const res = await request(app).get("/prescriptions/full/1");

    expect(res.status).toBe(200);
    expect(res.body.prescriptionId).toBe(1);
  });

  // FULL DETAILS NOT FOUND
  test("GET /prescriptions/full/:id returns 404 if not found", async () => {
    (PrescriptionService.getFullPrescriptionDetailsService as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/prescriptions/full/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Prescription not found" });
  });

  // ERROR CASES
  test("Handles internal server errors", async () => {
    (PrescriptionService.createPrescriptionService as jest.Mock).mockRejectedValue(new Error("fail"));
    const create = await request(app).post("/prescriptions").send({});
    expect(create.status).toBe(500);

    (PrescriptionService.getAllPrescriptionsService as jest.Mock).mockRejectedValue(new Error("fail"));
    const all = await request(app).get("/prescriptions");
    expect(all.status).toBe(500);

    (PrescriptionService.getPrescriptionByIdService as jest.Mock).mockRejectedValue(new Error("fail"));
    const byId = await request(app).get("/prescriptions/1");
    expect(byId.status).toBe(500);

    (PrescriptionService.updatePrescriptionService as jest.Mock).mockRejectedValue(new Error("fail"));
    const update = await request(app).put("/prescriptions/1").send({});
    expect(update.status).toBe(500);

    (PrescriptionService.deletePrescriptionService as jest.Mock).mockRejectedValue(new Error("fail"));
    const del = await request(app).delete("/prescriptions/1");
    expect(del.status).toBe(500);

    (PrescriptionService.getPrescriptionsByDoctorService as jest.Mock).mockRejectedValue(new Error("fail"));
    const byDoctor = await request(app).get("/doctors/2/prescriptions");
    expect(byDoctor.status).toBe(500);

    (PrescriptionService.getPrescriptionsByPatientService as jest.Mock).mockRejectedValue(new Error("fail"));
    const byPatient = await request(app).get("/patients/3/prescriptions");
    expect(byPatient.status).toBe(500);

    (PrescriptionService.getFullPrescriptionDetailsService as jest.Mock).mockRejectedValue(new Error("fail"));
    const full = await request(app).get("/prescriptions/full/1");
    expect(full.status).toBe(500);
  });
});

// Close DB after tests
import { client } from "../../src/Drizzle/db";
afterAll(async () => {
  await client.end();
});
