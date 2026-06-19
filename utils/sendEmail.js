import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification - MediGraph",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(to right, #3b82f6, #60a5fa); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
          <h2 style="margin: 0;">Welcome to MediGraph</h2>
        </div>
        <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
          <p style="color: #333; font-size: 16px;">Hello,</p>
          <p style="color: #555; font-size: 14px;">Thank you for signing up to MediGraph. Please verify your email address to complete your registration.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email</a>
          </div>
          
          <p style="color: #666; font-size: 12px;">If the button above doesn't work, copy and paste this link in your browser:</p>
          <p style="color: #3b82f6; font-size: 12px; word-break: break-all;">${verificationLink}</p>
          
          <p style="color: #999; font-size: 12px; margin-top: 20px;">This link will expire in 24 hours.</p>
          <p style="color: #999; font-size: 12px;">If you didn't sign up for MediGraph, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
};
