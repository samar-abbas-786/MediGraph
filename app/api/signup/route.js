import db from "@/database/db";
import Owner from "@/models/owner";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateVerificationToken, validateEmail } from "@/utils/tokenUtils";
import { sendVerificationEmail } from "@/utils/sendEmail";

export const POST = async (request) => {
  db();
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "missing field" }, { status: 400 });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: "invalid email format" },
        { status: 400 },
      );
    }

    const alreadyExist = await Owner.findOne({ email });
    if (alreadyExist) {
      return NextResponse.json(
        { message: "user already exist" },
        { status: 409 },
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const userResponse = await Owner.create({
      email,
      password: hashPassword,
      verificationToken,
      verificationTokenExpiry,
      isVerified: false,
    });

    if (!userResponse) {
      return NextResponse.json(
        { message: "user signup failed" },
        { status: 400 },
      );
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken);

    if (!emailResult.success) {
      // Delete the created user if email sending fails
      await Owner.deleteOne({ _id: userResponse._id });
      return NextResponse.json(
        { message: "failed to send verification email" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message:
          "user created successfully. please check your email to verify your account",
        user: {
          _id: userResponse._id,
          email: userResponse.email,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("sign-up error", error);
    return NextResponse.json(
      { message: "user signup failed" },
      { status: 500 },
    );
  }
};
