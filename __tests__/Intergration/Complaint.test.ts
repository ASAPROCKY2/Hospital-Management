import request from "supertest";
import express from "express";
import * as ComplaintService from "../../src/complaint/complaint.service";
import {
  createComplaintController,
  getAllComplaintsController,
  getComplaintByIdController,
  updateComplaintController,
  deleteComplaintController,
  getComplaintsByUserController,
  getComplaintsByDoctorController,
  getFullComplaintDetailsController
} from "../../src/complaint/complaint.controller";

// Step 1: Set up a minimal Express app for testing
const app = express();
app.use(express.json());
app.post("/complaints", createComplaintController as any);
app.get("/complaints", getAllComplaintsController as any);
app.get("/complaints/:id", getComplaintByIdController as any);
app.put("/complaints/:id", updateComplaintController as any);
app.delete("/complaints/:id", deleteComplaintController as any);
app.get("/complaints/user/:userID", getComplaintsByUserController as any);
app.get("/complaints/doctor/:doctorID", getComplaintsByDoctorController as any);
app.get("/complaints/full/:id", getFullComplaintDetailsController as any);

// Step 2: Mock the complaint service
jest.mock("../../src/complaint/complaint.service");

describe("Complaint Controller", () => {
  const fakeComplaint = {
    complaintID: 1,
    userID: 2,
    relatedAppointmentID: 3,
    subject: "Late Appointment",
    description: "Doctor was 30 mins late.",
    status: "Open"
  };

  test("POST /complaints should create a new complaint", async () => {
    (ComplaintService.createComplaintService as jest.Mock).mockResolvedValue("Complaint created successfully");

    const res = await request(app).post("/complaints").send(fakeComplaint);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "Complaint created successfully" });
  });

  test("GET /complaints should return all complaints", async () => {
    (ComplaintService.getAllComplaintsService as jest.Mock).mockResolvedValue([fakeComplaint]);

    const res = await request(app).get("/complaints");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([fakeComplaint]);
  });

  test("GET /complaints/:id should return a specific complaint", async () => {
    (ComplaintService.getComplaintByIdService as jest.Mock).mockResolvedValue(fakeComplaint);

    const res = await request(app).get("/complaints/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeComplaint);
  });

  test("GET /complaints/:id should return 404 if complaint not found", async () => {
    (ComplaintService.getComplaintByIdService as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app).get("/complaints/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Complaint not found" });
  });

  test("PUT /complaints/:id should update a complaint", async () => {
    (ComplaintService.updateComplaintService as jest.Mock).mockResolvedValue("Complaint updated successfully");

    const updates = { status: "Resolved" };
    const res = await request(app).put("/complaints/1").send(updates);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Complaint updated successfully" });
  });

  test("DELETE /complaints/:id should delete a complaint", async () => {
    (ComplaintService.deleteComplaintService as jest.Mock).mockResolvedValue("Complaint deleted successfully");

    const res = await request(app).delete("/complaints/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Complaint deleted successfully" });
  });

  test("GET /complaints/user/:userID should return complaints for a user", async () => {
    (ComplaintService.getComplaintsByUserService as jest.Mock).mockResolvedValue([fakeComplaint]);

    const res = await request(app).get("/complaints/user/2");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([fakeComplaint]);
  });

  test("GET /complaints/doctor/:doctorID should return complaints for a doctor", async () => {
    (ComplaintService.getComplaintsByDoctorService as jest.Mock).mockResolvedValue([fakeComplaint]);

    const res = await request(app).get("/complaints/doctor/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([fakeComplaint]);
  });

  test("GET /complaints/full/:id should return full complaint details", async () => {
    (ComplaintService.getFullComplaintDetailsService as jest.Mock).mockResolvedValue(fakeComplaint);

    const res = await request(app).get("/complaints/full/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeComplaint);
  });

  test("GET /complaints/full/:id should return 404 if full complaint details not found", async () => {
    (ComplaintService.getFullComplaintDetailsService as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app).get("/complaints/full/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Complaint not found" });
  });
});

// Close DB connection after tests if needed
import { client } from "../../src/Drizzle/db";
afterAll(async () => {
  await client.end();
});
