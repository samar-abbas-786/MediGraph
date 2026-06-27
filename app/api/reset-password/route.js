import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Owner from "@/models/owner";
import db from "@/database/db";

export async function POST(req) {
  try {
    const { token, email, password } = await req.json();
    console.log("Reset password request for:", email);

    // ── Validate ───────────────────────────────────────────────────
    if (!token || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // ── Connect DB first, then query ───────────────────────────────
    db();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const owner = await Owner.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    console.log("Owner found:", owner ? "yes" : "no");

    if (!owner) {
      return NextResponse.json(
        { message: "Invalid or expired reset link. Please request a new one." },
        { status: 400 },
      );
    }

    // ── Update password & clear reset token ────────────────────────
    owner.password = await bcrypt.hash(password, 10);
    owner.resetPasswordToken = null;
    owner.resetPasswordExpires = null;
    await owner.save();

    console.log("Password reset successful for:", email);

    return NextResponse.json(
      { message: "Password reset successful! You can now log in." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
