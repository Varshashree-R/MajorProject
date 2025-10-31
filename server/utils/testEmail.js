// server/utils/testEmail.js

import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config(); // Load .env variables

console.log("Starting email test...");

// Debug: check if env variables are loaded
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

// Check that credentials exist
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error(
    "ERROR: EMAIL_USER or EMAIL_PASS is missing in .env file. Check file location and format."
  );
  process.exit(1);
}

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,      // STARTTLS port
  secure: false,  // true if using port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test email function
const sendTestEmail = async () => {
  try {
    console.log("Sending test email...");

    const info = await transporter.sendMail({
      from: `"Tenantix Test" <${process.env.EMAIL_USER}>`, // sender
      to: process.env.EMAIL_USER, // send to yourself for testing
      subject: "Tenantix Test Email",
      html: "<h1>Tenantix Email Test</h1><p>If you see this email, it works!</p>",
    });

    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log(
      "Preview URL (only for test accounts):",
      nodemailer.getTestMessageUrl(info)
    );
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Run the test
sendTestEmail();
