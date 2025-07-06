import {
  createComplaintService,
  getAllComplaintsService,
  getComplaintByIdService,
  updateComplaintService,
  deleteComplaintService,
  getComplaintsByUserService,
  getComplaintsByDoctorService,
  getFullComplaintDetailsService
} from "../../src/complaint/complaint.service";

import db from "../../src/Drizzle/db";
import { ComplaintsTable } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => {
  const mockInsert = jest.fn(() => ({
    values: jest.fn().mockResolvedValueOnce(undefined)
  }));

  const mockUpdate = jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValueOnce(undefined)
  }));

  const mockDelete = jest.fn(() => ({
    where: jest.fn().mockResolvedValueOnce(undefined)
  }));

  const mockQuery = {
    ComplaintsTable: {
      findFirst: jest.fn(),
      findMany: jest.fn()
    }
  };

  return {
    __esModule: true,
    default: {
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      query: mockQuery
    }
  };
});

describe("Complaint Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createComplaintService", () => {
    it("should insert a complaint and return success message", async () => {
      const complaint = { description: "Late consultation" } as any;
      const result = await createComplaintService(complaint);
      expect(db.insert).toHaveBeenCalledWith(ComplaintsTable);
      expect(result).toBe("Complaint submitted successfully");
    });
  });

  describe("getAllComplaintsService", () => {
    it("should return all complaints", async () => {
      const mockComplaints = [{ complaint_id: 1, description: "Late" }];
      (db.query.ComplaintsTable.findMany as jest.Mock).mockResolvedValueOnce(mockComplaints);
      const result = await getAllComplaintsService();
      expect(result).toEqual(mockComplaints);
    });
  });

  describe("getComplaintByIdService", () => {
    it("should return a complaint by ID", async () => {
      const mockComplaint = { complaint_id: 2, description: "Unprofessional" };
      (db.query.ComplaintsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockComplaint);
      const result = await getComplaintByIdService(2);
      expect(result).toEqual(mockComplaint);
    });
  });

  describe("updateComplaintService", () => {
    it("should update a complaint and return success message", async () => {
      const mockSet = jest.fn().mockReturnThis();
      const mockWhere = jest.fn().mockResolvedValueOnce(undefined);

      (db.update as jest.Mock).mockReturnValueOnce({ set: mockSet, where: mockWhere });

      const result = await updateComplaintService(1, { description: "Updated" });
      expect(db.update).toHaveBeenCalledWith(ComplaintsTable);
      expect(mockSet).toHaveBeenCalledWith({ description: "Updated" });
      expect(result).toBe("Complaint updated successfully");
    });
  });

  describe("deleteComplaintService", () => {
    it("should delete a complaint and return success message", async () => {
      const mockWhere = jest.fn().mockResolvedValueOnce(undefined);
      (db.delete as jest.Mock).mockReturnValueOnce({ where: mockWhere });
      const result = await deleteComplaintService(1);
      expect(db.delete).toHaveBeenCalledWith(ComplaintsTable);
      expect(result).toBe("Complaint deleted successfully");
    });
  });

  describe("getComplaintsByUserService", () => {
    it("should return complaints filed by a user", async () => {
      const mockData = [{ complaint_id: 1, user_id: 1, description: "Delay" }];
      (db.query.ComplaintsTable.findMany as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getComplaintsByUserService(1);
      expect(result).toEqual(mockData);
    });
  });

  describe("getComplaintsByDoctorService", () => {
    it("should return complaints against a doctor", async () => {
      const mockData = [{ complaint_id: 2, doctor_id: 5, description: "Rude" }];
      (db.query.ComplaintsTable.findMany as jest.Mock).mockResolvedValueOnce(mockData);
      const result = await getComplaintsByDoctorService(5);
      expect(result).toEqual(mockData);
    });
  });

  describe("getFullComplaintDetailsService", () => {
    it("should return complaint with user, doctor, and appointment info", async () => {
      const mockComplaint = {
        complaint_id: 3,
        user: { user_id: 1 },
        doctor: { doctor_id: 2 },
        appointment: { appointment_id: 7 }
      };
      (db.query.ComplaintsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockComplaint);
      const result = await getFullComplaintDetailsService(3);
      expect(result).toEqual(mockComplaint);
    });
  });
});
