import {
  createAppointmentService,
  getAllAppointmentsService,
  getAppointmentByIdService,
  updateAppointmentService,
  deleteAppointmentService,
  getAppointmentsByDoctorService,
  getAppointmentsByUserService
} from "../../src/appointment/appointment.service";

import db from "../../src/Drizzle/db";
import { AppointmentsTable } from "../../src/Drizzle/schema";

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
    AppointmentsTable: {
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

describe("Appointment Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createAppointmentService", () => {
    it("should insert an appointment and return success message", async () => {
      const appointment = { user_id: 1, doctor_id: 2, date: "2025-07-07" };
      const result = await createAppointmentService(appointment as any);
      expect(db.insert).toHaveBeenCalledWith(AppointmentsTable);
      expect(result).toBe("Appointment created successfully");
    });
  });

  describe("getAllAppointmentsService", () => {
    it("should return all appointments with nested data", async () => {
      const mockAppointments = [
        { appointment_id: 1, user: {}, doctor: {}, prescriptions: [], payments: [] }
      ];
      (db.query.AppointmentsTable.findMany as jest.Mock).mockResolvedValueOnce(mockAppointments);
      const result = await getAllAppointmentsService();
      expect(result).toEqual(mockAppointments);
    });
  });

  describe("getAppointmentByIdService", () => {
    it("should return appointment with nested user, doctor, prescriptions, and payments", async () => {
      const mockAppointment = {
        appointment_id: 1,
        user: {},
        doctor: {},
        prescriptions: [],
        payments: []
      };
      (db.query.AppointmentsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockAppointment);
      const result = await getAppointmentByIdService(1);
      expect(result).toEqual(mockAppointment);
    });

    it("should return null if appointment not found", async () => {
      (db.query.AppointmentsTable.findFirst as jest.Mock).mockResolvedValueOnce(null);
      const result = await getAppointmentByIdService(999);
      expect(result).toBeNull();
    });
  });

  describe("updateAppointmentService", () => {
  it("should update appointment and return success message", async () => {
    const mockSet = jest.fn().mockReturnThis();
    const mockWhere = jest.fn().mockResolvedValueOnce(undefined);

    // Mock the db.update chain
    (db.update as jest.Mock).mockReturnValueOnce({
      set: mockSet,
      where: mockWhere
    });

    const updateData = { appointment_date: "2025-07-08" };
    const result = await updateAppointmentService(1, updateData);

    expect(mockSet).toHaveBeenCalledWith({ appointment_date: "2025-07-08" });
    expect(mockWhere).toHaveBeenCalled();
    expect(result).toBe("Appointment updated successfully");
  });
});


  describe("deleteAppointmentService", () => {
    it("should delete appointment and return success message", async () => {
      const mockWhere = jest.fn().mockResolvedValueOnce(undefined);
      (db.delete as jest.Mock).mockReturnValueOnce({ where: mockWhere });
      const result = await deleteAppointmentService(1);
      expect(db.delete).toHaveBeenCalledWith(AppointmentsTable);
      expect(mockWhere).toHaveBeenCalled();
      expect(result).toBe("Appointment deleted successfully");
    });
  });

  describe("getAppointmentsByDoctorService", () => {
    it("should return appointments for a specific doctor", async () => {
      const mockAppointments = [
        { appointment_id: 1, user: {}, prescriptions: [], payments: [] }
      ];
      (db.query.AppointmentsTable.findMany as jest.Mock).mockResolvedValueOnce(mockAppointments);
      const result = await getAppointmentsByDoctorService(2);
      expect(result).toEqual(mockAppointments);
    });
  });

  describe("getAppointmentsByUserService", () => {
    it("should return appointments for a specific user", async () => {
      const mockAppointments = [
        { appointment_id: 1, doctor: {}, prescriptions: [], payments: [] }
      ];
      (db.query.AppointmentsTable.findMany as jest.Mock).mockResolvedValueOnce(mockAppointments);
      const result = await getAppointmentsByUserService(1);
      expect(result).toEqual(mockAppointments);
    });
  });
});
