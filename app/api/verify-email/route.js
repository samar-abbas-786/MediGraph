import db from "@/database/db";
import Owner from "@/models/owner";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  db();
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "verification token is required" },
        { status: 400 },
      );
    }

    const user = await Owner.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "invalid or expired verification token" },
        { status: 400 },
      );
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      {
        message: "email verified successfully. you can now login",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("verification error", error);
    return NextResponse.json(
      { message: "verification failed" },
      { status: 500 },
    );
  }
};
