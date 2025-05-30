import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD,
  },
});

export async function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: `"MedHealth Team" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
}
