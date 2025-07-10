import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

export const sendEmail = async (
    email: string,
    subject: string,
    message: string,
    html: string
) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, 
            },
        });

        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            text: message,
            html,
        };

        const mailRes = await transporter.sendMail(mailOptions);
        console.log("Email response:", mailRes);

        if (mailRes.accepted.length > 0) {
            return "Email sent successfully";
        } else {
            throw new Error("Email was not accepted by the server");
        }
    } catch (error: any) {
        console.error("Failed to send email:", error);
        throw new Error("Failed to send email");
    }
};