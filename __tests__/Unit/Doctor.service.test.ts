import {
  createDoctorService,
  getAllDoctorsService,
  getDoctorByIdService,
  updateDoctorService,
  deleteDoctorService,
  getDoctorWithAppointmentsService,
  getDoctorWithPrescriptionsService
} from "../../src/doctor/doctor.service";

import db from "../../src/Drizzle/db";
import { DoctorsTable } from "../../src/Drizzle/schema";

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
    DoctorsTable: {
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

describe("Doctor Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createDoctorService", () => {
    it("should create a new doctor and return success message", async () => {
      const doctor = { name: "Dr. John", specialization: "Cardiology" } as any;
      const result = await createDoctorService(doctor);
      expect(db.insert).toHaveBeenCalledWith(DoctorsTable);
      expect(result).toBe("Doctor created successfully");
    });
  });

  describe("getAllDoctorsService", () => {
    it("should return all doctors", async () => {
      const mockDoctors = [
        { doctor_id: 1, name: "Dr. John" },
        { doctor_id: 2, name: "Dr. Jane" }
      ];
      (db.query.DoctorsTable.findMany as jest.Mock).mockResolvedValueOnce(mockDoctors);
      const result = await getAllDoctorsService();
      expect(result).toEqual(mockDoctors);
    });
  });

  describe("getDoctorByIdService", () => {
    it("should return a doctor by ID", async () => {
      const mockDoctor = { doctor_id: 1, name: "Dr. John" };
      (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockDoctor);
      const result = await getDoctorByIdService(1);
      expect(result).toEqual(mockDoctor);
    });
  });

  describe("updateDoctorService", () => {
    it("should update a doctor and return success message", async () => {
      const mockSet = jest.fn().mockReturnThis();
      const mockWhere = jest.fn().mockResolvedValueOnce(undefined);
      (db.update as jest.Mock).mockReturnValueOnce({ set: mockSet, where: mockWhere });

      const result = await updateDoctorService(1, { first_name: "John", last_name: "Updated" });

      expect(mockSet).toHaveBeenCalledWith({ first_name: "John", last_name: "Updated" });
      expect(mockWhere).toHaveBeenCalled();
      expect(result).toBe("Doctor updated successfully");
    });
  });

  describe("deleteDoctorService", () => {
    it("should delete a doctor and return success message", async () => {
      const mockWhere = jest.fn().mockResolvedValueOnce(undefined);
      (db.delete as jest.Mock).mockReturnValueOnce({ where: mockWhere });

      const result = await deleteDoctorService(1);
      expect(db.delete).toHaveBeenCalledWith(DoctorsTable);
      expect(result).toBe("Doctor deleted successfully");
    });
  });

  describe("getDoctorWithAppointmentsService", () => {
    it("should return doctor with appointments and related data", async () => {
      const mockDoctor = {
        doctor_id: 1,
        appointments: [
          {
            appointment_id: 1,
            user: { user_id: 2, firstname: "John" },
            prescriptions: [],
            payments: []
          }
        ]
      };

      (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockDoctor);
      const result = await getDoctorWithAppointmentsService(1);
      expect(result).toEqual(mockDoctor);
    });
  });

  describe("getDoctorWithPrescriptionsService", () => {
    it("should return doctor with prescriptions and appointment data", async () => {
      const mockDoctor = {
        doctor_id: 1,
        prescriptions: [
          {
            prescription_id: 10,
            appointment: { appointment_id: 5, date: "2025-07-06" }
          }
        ]
      };

      (db.query.DoctorsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockDoctor);
      const result = await getDoctorWithPrescriptionsService(1);
      expect(result).toEqual(mockDoctor);
    });
  });
});
