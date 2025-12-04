import db from "@/database/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Owner from "@/models/owner";

export const POST = async (request) => {
  db();
  try {
    const { email, password } = await request.json();
    console.log("input data", email, password);
    if (!email || !password) {
      return NextResponse.json({ message: "Missing field" }, { status: 400 });
    }
    const isExist = await Owner.findOne({ email });
    if (!isExist) {
      return NextResponse.json({ message: "User not exist" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, isExist.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect Password" },
        { status: 400 }
      );
    } else {
      const user = {
        _id: isExist._id,
        email: isExist.email,
      };

      const token = jwt.sign({ id: isExist._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
      });
      console.log("token", token);
      const cokkie = (await cookies()).set("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      console.log("cookie", cokkie);

      return NextResponse.json(
        {
          message: "user login successfully",
          user,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("login error", error);
    return NextResponse.json({ message: "Login error" }, { status: 500 });
  }
};
