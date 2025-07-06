import {
  createPaymentService,
  getAllPaymentsService,
  getPaymentByIdService,
  updatePaymentService,
  deletePaymentService,
  getPaymentsByAppointmentService,
  getFullPaymentDetailsService
} from "../../src/payment/payment.service";

import db from "../../src/Drizzle/db";
import { PaymentsTable } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => {
  const mockInsert = jest.fn(() => ({
    values: jest.fn().mockResolvedValueOnce(undefined),
  }));

  const mockUpdate = jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValueOnce(undefined),
  }));

  const mockDelete = jest.fn(() => ({
    where: jest.fn().mockResolvedValueOnce(undefined),
  }));

  const mockQuery = {
    PaymentsTable: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  };

  return {
    __esModule: true,
    default: {
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      query: mockQuery,
    },
  };
});

describe("Payment Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createPaymentService", () => {
  it("should insert a payment and return success message", async () => {
    const payment = {
      appointment_id: 1,
      amount: "2000",
      payment_status: "paid" as "paid", 
    };

    const result = await createPaymentService(payment);
    expect(db.insert).toHaveBeenCalledWith(PaymentsTable);
    expect(result).toBe("Payment recorded successfully");
  });
});


  describe("getAllPaymentsService", () => {
    it("should return all payments with appointment info", async () => {
      const mockPayments = [
        {
          payment_id: 1,
          amount: "2000",
          appointment: { appointment_id: 1, date: "2025-07-08" },
        },
      ];
      (db.query.PaymentsTable.findMany as jest.Mock).mockResolvedValueOnce(mockPayments);

      const result = await getAllPaymentsService();
      expect(db.query.PaymentsTable.findMany).toHaveBeenCalledWith({
        with: { appointment: true },
      });
      expect(result).toEqual(mockPayments);
    });
  });

  describe("getPaymentByIdService", () => {
    it("should return payment with appointment by ID", async () => {
      const mockPayment = {
        payment_id: 1,
        amount: "2500",
        appointment: { appointment_id: 1, date: "2025-07-08" },
      };
      (db.query.PaymentsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockPayment);

      const result = await getPaymentByIdService(1);
      expect(result).toEqual(mockPayment);
    });
  });

  describe("updatePaymentService", () => {
    it("should update a payment and return success message", async () => {
      const mockSet = jest.fn().mockReturnThis();
      const mockWhere = jest.fn().mockResolvedValueOnce(undefined);
      (db.update as jest.Mock).mockReturnValueOnce({ set: mockSet, where: mockWhere });

      const result = await updatePaymentService(1, { amount: "3000" });

      expect(mockSet).toHaveBeenCalledWith({ amount: "3000" });
      expect(mockWhere).toHaveBeenCalled();
      expect(result).toBe("Payment updated successfully");
    });
  });

  describe("deletePaymentService", () => {
    it("should delete a payment and return success message", async () => {
      const mockWhere = jest.fn().mockResolvedValueOnce(undefined);
      (db.delete as jest.Mock).mockReturnValueOnce({ where: mockWhere });

      const result = await deletePaymentService(1);
      expect(db.delete).toHaveBeenCalledWith(PaymentsTable);
      expect(result).toBe("Payment deleted successfully");
    });
  });

  describe("getPaymentsByAppointmentService", () => {
    it("should return payments for a specific appointment", async () => {
      const mockPayments = [
        {
          payment_id: 1,
          amount: "1000",
          appointment: { appointment_id: 2, date: "2025-07-07" },
        },
      ];
      (db.query.PaymentsTable.findMany as jest.Mock).mockResolvedValueOnce(mockPayments);

      const result = await getPaymentsByAppointmentService(2);
      expect(result).toEqual(mockPayments);
    });
  });

  describe("getFullPaymentDetailsService", () => {
    it("should return full payment details including user and doctor", async () => {
      const mockDetails = {
        payment_id: 1,
        amount: "4500",
        appointment: {
          appointment_id: 5,
          user: { user_id: 1, firstname: "John" },
          doctor: { doctor_id: 2, name: "Dr. Kim" },
        },
      };
      (db.query.PaymentsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockDetails);

      const result = await getFullPaymentDetailsService(1);
      expect(result).toEqual(mockDetails);
    });
  });
});
