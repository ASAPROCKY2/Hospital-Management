import { Request, Response } from "express";
import {
  createPaymentService,
  getAllPaymentsService,
  getPaymentByIdService,
  updatePaymentService,
  deletePaymentService,
  getPaymentsByAppointmentService,
  getFullPaymentDetailsService,
  initiatePaymentService
} from "./payment.service";

// ✅ Create a new payment manually
export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await createPaymentService(data);
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Create payment error:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
};

// ✅ Get all payments
export const getAllPaymentsController = async (_req: Request, res: Response) => {
  try {
    const payments = await getAllPaymentsService();
    res.status(200).json(payments);
  } catch (error: any) {
    console.error("Get all payments error:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

// ✅ Get payment by ID
export const getPaymentByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payment = await getPaymentByIdService(id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.status(200).json(payment);
  } catch (error: any) {
    console.error("Get payment by ID error:", error);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
};

// ✅ Update payment
export const updatePaymentController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updates = req.body;
    const result = await updatePaymentService(id, updates);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Update payment error:", error);
    res.status(500).json({ error: "Failed to update payment" });
  }
};

// ✅ Delete payment
export const deletePaymentController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await deletePaymentService(id);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Delete payment error:", error);
    res.status(500).json({ error: "Failed to delete payment" });
  }
};

// ✅ Get payments by appointment
export const getPaymentsByAppointmentController = async (req: Request, res: Response) => {
  try {
    const appointmentID = Number(req.params.appointmentID);
    const payments = await getPaymentsByAppointmentService(appointmentID);
    res.status(200).json(payments);
  } catch (error: any) {
    console.error("Get payments by appointment error:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

// ✅ Get full payment details
export const getFullPaymentDetailsController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payment = await getFullPaymentDetailsService(id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.status(200).json(payment);
  } catch (error: any) {
    console.error("Get full payment details error:", error);
    res.status(500).json({ error: "Failed to fetch payment details" });
  }
};

// ✅ Initiate M-Pesa STK Push
export const initiatePaymentController = async (req: Request, res: Response) => {
  try {
    const { appointment_id, user_id, phoneNumber, amount } = req.body;
    if (!appointment_id || !phoneNumber || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await initiatePaymentService(
      Number(appointment_id),
      user_id ? Number(user_id) : null,
      phoneNumber,
      Number(amount)
    );

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Initiate payment error:", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};
