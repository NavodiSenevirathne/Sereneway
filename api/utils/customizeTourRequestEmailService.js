import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  port: process.env.SMTP_PORT || 2525,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "your-default-user",
    pass: process.env.SMTP_PASS || "your-default-pass",
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} content - Email body content (can be plain text or HTML)
 * @param {boolean} isHtml - Flag to determine if content is HTML (default: true)
 */
export const sendEmail = async (to, subject, content, isHtml = true) => {
  try {
    const mailOptions = {
      from: `"ITP App" <no-reply@itpapp.com>`, // Change sender email if needed
      to,
      subject,
      [isHtml ? "html" : "text"]: content, // Send as HTML or plain text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email", error };
  }
};

export default transporter;
