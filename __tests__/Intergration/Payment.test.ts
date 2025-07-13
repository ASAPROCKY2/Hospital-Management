import request from "supertest";
import express from "express";
import * as PaymentService from "../../src/payment/payment.service";
import {
  createPaymentController,
  getAllPaymentsController,
  getPaymentByIdController,
  updatePaymentController,
  deletePaymentController,
  getPaymentsByAppointmentController,
  getFullPaymentDetailsController
} from "../../src/payment/payment.controller";

// Step 1: Setup a minimal express app for testing
const app = express();
app.use(express.json());

app.post("/payments", createPaymentController as any);
app.get("/payments", getAllPaymentsController as any);
app.get("/payments/:id", getPaymentByIdController as any);
app.put("/payments/:id", updatePaymentController as any);
app.delete("/payments/:id", deletePaymentController as any);
app.get("/appointments/:appointmentID/payments", getPaymentsByAppointmentController as any);
app.get("/payments/full/:id", getFullPaymentDetailsController as any);

// Step 2: Mock the payment service
jest.mock("../../src/payment/payment.service");

describe("Payment Controller", () => {
  // Test: create payment
  test("POST /payments should create a payment", async () => {
    const newPayment = {
      appointmentId: 1,
      amount: 1500,
      paymentStatus: "Completed",
      transactionId: "TXN123456",
      paymentDate: "2025-07-11"
    };

    (PaymentService.createPaymentService as jest.Mock).mockResolvedValue("Payment created");

    const res = await request(app).post("/payments").send(newPayment);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "Payment created" });
  });

  // Test: get all payments
  test("GET /payments should return all payments", async () => {
    (PaymentService.getAllPaymentsService as jest.Mock).mockResolvedValue([
      { paymentId: 1, amount: 1500 }
    ]);

    const res = await request(app).get("/payments");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test: get payment by ID
  test("GET /payments/:id should return a payment", async () => {
    (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue({
      paymentId: 1,
      amount: 1500
    });

    const res = await request(app).get("/payments/1");

    expect(res.status).toBe(200);
    expect(res.body.paymentId).toBe(1);
  });

  // Test: get payment by invalid ID returns 404
  test("GET /payments/:id should return 404 if not found", async () => {
    (PaymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/payments/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Payment not found" });
  });

  // Test: update payment
  test("PUT /payments/:id should update a payment", async () => {
    (PaymentService.updatePaymentService as jest.Mock).mockResolvedValue("Payment updated");

    const res = await request(app).put("/payments/1").send({ amount: 2000 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Payment updated" });
  });

  // Test: delete payment
  test("DELETE /payments/:id should delete a payment", async () => {
    (PaymentService.deletePaymentService as jest.Mock).mockResolvedValue("Payment deleted");

    const res = await request(app).delete("/payments/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Payment deleted" });
  });

  // Test: get payments by appointment
  test("GET /appointments/:appointmentID/payments should return payments for an appointment", async () => {
    (PaymentService.getPaymentsByAppointmentService as jest.Mock).mockResolvedValue([
      { paymentId: 1, appointmentId: 2, amount: 1000 }
    ]);

    const res = await request(app).get("/appointments/2/payments");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test: get full payment details
  test("GET /payments/full/:id should return full payment details", async () => {
    (PaymentService.getFullPaymentDetailsService as jest.Mock).mockResolvedValue({
      paymentId: 1,
      appointmentId: 2,
      transactionId: "TXN123456",
      amount: 1500
    });

    const res = await request(app).get("/payments/full/1");

    expect(res.status).toBe(200);
    expect(res.body.paymentId).toBe(1);
  });

  // Test: full details not found
  test("GET /payments/full/:id should return 404 if not found", async () => {
    (PaymentService.getFullPaymentDetailsService as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/payments/full/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Payment not found" });
  });

  // Test: internal server errors
  test("Handles internal server errors", async () => {
    (PaymentService.getAllPaymentsService as jest.Mock).mockRejectedValue(new Error("Failed"));
    const all = await request(app).get("/payments");
    expect(all.status).toBe(500);

    (PaymentService.getPaymentByIdService as jest.Mock).mockRejectedValue(new Error("Failed"));
    const one = await request(app).get("/payments/1");
    expect(one.status).toBe(500);

    (PaymentService.createPaymentService as jest.Mock).mockRejectedValue(new Error("Failed"));
    const create = await request(app).post("/payments").send({});
    expect(create.status).toBe(500);

    (PaymentService.updatePaymentService as jest.Mock).mockRejectedValue(new Error("Failed"));
    const update = await request(app).put("/payments/1").send({});
    expect(update.status).toBe(500);

    (PaymentService.deletePaymentService as jest.Mock).mockRejectedValue(new Error("Failed"));
    const del = await request(app).delete("/payments/1");
    expect(del.status).toBe(500);

    (PaymentService.getPaymentsByAppointmentService as jest.Mock).mockRejectedValue(new Error("Failed"));
    const byAppointment = await request(app).get("/appointments/1/payments");
    expect(byAppointment.status).toBe(500);

    (PaymentService.getFullPaymentDetailsService as jest.Mock).mockRejectedValue(new Error("Failed"));
    const full = await request(app).get("/payments/full/1");
    expect(full.status).toBe(500);
  });
});

// DB connection close
import { client } from "../../src/Drizzle/db";
afterAll(async () => {
  await client.end();
});
