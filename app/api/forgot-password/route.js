import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Owner from "@/models/owner";
import db from "@/database/db";

export async function POST(req) {
  try {
    const { email } = await req.json();
    console.log("Forgot password request for:", email);

    // ── Validate ───────────────────────────────────────────────────
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 },
      );
    }

    // ── Connect DB first, then query ───────────────────────────────
    db();
    const owner = await Owner.findOne({ email });
    console.log("Owner found:", owner ? "yes" : "no");

    // Don't reveal whether email is registered
    if (!owner) {
      return NextResponse.json(
        { message: "If this email is registered, a reset link has been sent." },
        { status: 200 },
      );
    }

    // ── Check if owner is verified ─────────────────────────────────
    if (!owner.isVerified) {
      return NextResponse.json(
        { message: "Please verify your email before resetting your password." },
        { status: 403 },
      );
    }

    // ── Generate token ─────────────────────────────────────────────
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    owner.resetPasswordToken = hashedToken;
    owner.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await owner.save();

    // ── Build reset URL ────────────────────────────────────────────
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // ── Send email ─────────────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"MediPocket" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;
                    border:1px solid #e2e8f0;border-radius:12px;">
          <h2 style="color:#1e293b;margin-bottom:8px;">Reset Your Password</h2>
          <p style="color:#64748b;margin-bottom:24px;">
            We received a request to reset the password for your account
            (<strong>${email}</strong>).<br/>
            This link expires in <strong>1 hour</strong>.
          </p>
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 28px;background:#3b82f6;
                    color:#fff;font-weight:600;border-radius:8px;text-decoration:none;">
            Reset Password
          </a>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
            If you didn't request this, you can safely ignore this email.
            Your password will not change.
          </p>
          <p style="color:#cbd5e1;font-size:11px;margin-top:8px;word-break:break-all;">
            Or copy this link:<br/>
            <a href="${resetUrl}" style="color:#3b82f6;">${resetUrl}</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "If this email is registered, a reset link has been sent." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
