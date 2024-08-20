// utils/email.js

import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (
  resetURL: string,
  email: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: "no-reply@yourdomain.com",
    to: email,
    subject: "Reset Your Password",
    html: `<p>We received a request to reset your password. You can reset your password by clicking the link below:</p>
    <p>
     <a href="${resetURL}">Reset Password</a>
      </p>
      <p>If you have trouble clicking the link, copy and paste this URL into your browser:</p>
      <p>${resetURL}</p>

    <p>If you did not request a password reset, please ignore this email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw new Error("Failed to send reset password email");
  }
};
