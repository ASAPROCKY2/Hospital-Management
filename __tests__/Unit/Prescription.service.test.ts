import {
  createPrescriptionService,
  getAllPrescriptionsService,
  getPrescriptionByIdService,
  updatePrescriptionService,
  deletePrescriptionService,
  getPrescriptionsByDoctorService,
  getPrescriptionsByPatientService,
  getFullPrescriptionDetailsService
} from "../../src/prescription/prescription.service";

import db from "../../src/Drizzle/db";
import { PrescriptionsTable } from "../../src/Drizzle/schema";

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
    PrescriptionsTable: {
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

describe("Prescription Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a prescription", async () => {
    const prescription = { doctor_id: 1, appointment_id: 1, patient_id: 2, drug: "Ibuprofen" };
    const result = await createPrescriptionService(prescription);
    expect(db.insert).toHaveBeenCalledWith(PrescriptionsTable);
    expect(result).toBe("Prescription created successfully");
  });

  it("should return all prescriptions", async () => {
    const mockPrescriptions = [{ prescription_id: 1, drug: "Paracetamol" }];
    (db.query.PrescriptionsTable.findMany as jest.Mock).mockResolvedValueOnce(mockPrescriptions);

    const result = await getAllPrescriptionsService();
    expect(result).toEqual(mockPrescriptions);
  });

  it("should return a prescription by ID", async () => {
    const mockPrescription = { prescription_id: 1, drug: "Amoxicillin" };
    (db.query.PrescriptionsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockPrescription);

    const result = await getPrescriptionByIdService(1);
    expect(result).toEqual(mockPrescription);
  });

  it("should update a prescription", async () => {
    const result = await updatePrescriptionService(1, { notes: "Updated notes" });
    expect(result).toBe("Prescription updated successfully");
  });

  it("should delete a prescription", async () => {
    const result = await deletePrescriptionService(1);
    expect(result).toBe("Prescription deleted successfully");
  });

  it("should return prescriptions for a doctor", async () => {
    const mockData = [{ prescription_id: 1, doctor_id: 1 }];
    (db.query.PrescriptionsTable.findMany as jest.Mock).mockResolvedValueOnce(mockData);

    const result = await getPrescriptionsByDoctorService(1);
    expect(result).toEqual(mockData);
  });

  it("should return prescriptions for a patient", async () => {
    const mockData = [{ prescription_id: 1, patient_id: 2 }];
    (db.query.PrescriptionsTable.findMany as jest.Mock).mockResolvedValueOnce(mockData);

    const result = await getPrescriptionsByPatientService(2);
    expect(result).toEqual(mockData);
  });

  it("should return full prescription details", async () => {
    const mockData = {
      prescription_id: 1,
      doctor: { doctor_id: 1 },
      patient: { patient_id: 2 },
      appointment: { appointment_id: 3 }
    };
    (db.query.PrescriptionsTable.findFirst as jest.Mock).mockResolvedValueOnce(mockData);

    const result = await getFullPrescriptionDetailsService(1);
    expect(result).toEqual(mockData);
  });
});
