import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const middleware = async (request) => {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    return NextResponse.next();
  } catch (error) {
    console.log("Token error in middleware", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
};
