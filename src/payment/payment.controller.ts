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
} from "./payment.service";

// Create a new payment
export const createPaymentController = async (req: Request, res: Response) => {
  const data = req.body;
  const result = await createPaymentService(data);
  res.status(201).json({ message: result });
};

// Get all payments
export const getAllPaymentsController = async (_req: Request, res: Response) => {
  const payments = await getAllPaymentsService();
  res.status(200).json(payments);
};

// Get payment by ID
export const getPaymentByIdController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const payment = await getPaymentByIdService(id);
  if (!payment) return res.status(404).json({ error: "Payment not found" });
  res.status(200).json(payment);
};

// Update payment
export const updatePaymentController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updates = req.body;
  const result = await updatePaymentService(id, updates);
  res.status(200).json({ message: result });
};

// Delete payment
export const deletePaymentController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await deletePaymentService(id);
  res.status(200).json({ message: result });
};

// Get payments by appointment
export const getPaymentsByAppointmentController = async (req: Request, res: Response) => {
  const appointmentID = Number(req.params.appointmentID);
  const payments = await getPaymentsByAppointmentService(appointmentID);
  res.status(200).json(payments);
};

// Get full payment details
export const getFullPaymentDetailsController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const payment = await getFullPaymentDetailsService(id);
  if (!payment) return res.status(404).json({ error: "Payment not found" });
  res.status(200).json(payment);
};
