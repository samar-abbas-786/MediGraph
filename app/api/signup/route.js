import db from "@/database/db";
import Owner from "@/models/owner";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  db();
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: "missing field" }, { status: 400 });
    }
    const alreadyExist = await Owner.findOne({ email });
    if (alreadyExist) {
      return NextResponse.json(
        { message: "user already exist" },
        { status: 409 }
      );
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const userResponse = await Owner.create({
      email,
      password: hashPassword,
    });

    if (!userResponse) {
      return NextResponse.json(
        { message: "user signup failed" },
        { status: 400 }
      );
    } else {
      const user = {
        _id: userResponse._id,
        email: userResponse.email,
      };
      return NextResponse.json(
        {
          message: "user created successfully",
          user,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("sign-up error", error);
    return NextResponse.json(
      { message: "user signup failed" },
      { status: 500 }
    );
  }
};
