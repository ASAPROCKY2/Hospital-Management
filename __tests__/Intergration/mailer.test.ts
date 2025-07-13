import { sendEmail } from "../../src/Mailer/mailer";
import nodemailer from "nodemailer";

jest.mock("nodemailer");

describe("Mailer Module", () => {
  const sendMailMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock createTransport to return the mocked sendMail function
    // @ts-ignore
    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  test("should send email successfully", async () => {
    sendMailMock.mockResolvedValue({ accepted: ["test@example.com"] });

    const res = await sendEmail(
      "test@example.com",
      "Subject",
      "Text message",
      "<p>HTML</p>"
    );

    expect(res).toBe("Email sent successfully");
  });

  test("should throw if email not accepted", async () => {
    sendMailMock.mockResolvedValue({ accepted: [] });

    await expect(
      sendEmail("fail@example.com", "Subject", "Body", "<html></html>")
    ).rejects.toThrow("Failed to send email");
  });

  test("should handle transporter errors", async () => {
    sendMailMock.mockRejectedValue(new Error("SMTP error"));

    await expect(
      sendEmail("error@example.com", "Subject", "Body", "<html></html>")
    ).rejects.toThrow("Failed to send email");
  });
});
