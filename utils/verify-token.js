import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const verifyToken = async () => {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    const { payload } = await jwtVerify(token, secret);

    return payload?.id || null;
  } catch (err) {
    console.error("JWT verification failed:", err.message);

    return null;
  }
};
