// src/payment/payment.controller.ts

import { Request, Response } from "express";
import {
  createPaymentService,
  getAllPaymentsService,
  getPaymentByIdService,
  updatePaymentService,
  deletePaymentService,
  getPaymentsByAppointmentService,
  getFullPaymentDetailsService,
  initiatePaymentService,
  handlePaymentCallbackService,
} from "./payment.service";



export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const result = await createPaymentService(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
};

export const getAllPaymentsController = async (_req: Request, res: Response) => {
  try {
    const payments = await getAllPaymentsService();
    res.status(200).json(payments);
  } catch (error) {
    console.error("Get all payments error:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

export const getPaymentByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payment = await getPaymentByIdService(id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.status(200).json(payment);
  } catch (error) {
    console.error("Get payment by ID error:", error);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
};

export const updatePaymentController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updates = req.body;
    const result = await updatePaymentService(id, updates);
    res.status(200).json(result);
  } catch (error) {
    console.error("Update payment error:", error);
    res.status(500).json({ error: "Failed to update payment" });
  }
};

export const deletePaymentController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await deletePaymentService(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Delete payment error:", error);
    res.status(500).json({ error: "Failed to delete payment" });
  }
};

export const getPaymentsByAppointmentController = async (req: Request, res: Response) => {
  try {
    const appointmentID = Number(req.params.appointmentID);
    const payments = await getPaymentsByAppointmentService(appointmentID);
    res.status(200).json(payments);
  } catch (error) {
    console.error("Get payments by appointment error:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

export const getFullPaymentDetailsController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payment = await getFullPaymentDetailsService(id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.status(200).json(payment);
  } catch (error) {
    console.error("Get full payment details error:", error);
    res.status(500).json({ error: "Failed to fetch payment details" });
  }
};


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
  } catch (error) {
    console.error("Initiate payment error:", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};

export const handlePaymentCallbackController = async (req: Request, res: Response) => {
  try {
    console.log(" M-Pesa Callback Received:", JSON.stringify(req.body, null, 2));

    const result = await handlePaymentCallbackService(req.body);

    res.status(200).json(result);
  } catch (error) {
    console.error("Payment callback error:", error);
    res.status(500).json({ error: "Failed to process payment callback" });
  }
};
