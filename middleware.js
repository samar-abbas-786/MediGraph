import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const middleware = async (request) => {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    await jwtVerify(token, secret);

    return NextResponse.next();
  } catch (error) {
    console.log("Token error in middleware", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
};

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/api/:path*"],
};
