import nodemailer from "nodemailer";
import dotenv from "dotenv"; //to use environment variables
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email using nodemailer transporter GMAIL
 */
export const sendEmail = async (to, from, subject, body) => {
  try {
   const info = await transporter.sendMail({
      from: `"Tenantix" <${process.env.EMAIL_USER}>`, // must match Gmail App Password
      to,
      subject,
      html: body,
    });
    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.log("Error sending email:", error);
  }
};