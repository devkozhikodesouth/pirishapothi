import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // In a real app, verify against the database.
    if (email === "admin@pothi.com" && password === "admin123") {
      const secret = process.env.JWT_SECRET || "fallback_secret";
      
      const token = jwt.sign({ email, role: "admin" }, secret, {
        expiresIn: "1d",
      });

      const response = NextResponse.json(
        { message: "Login successful" },
        { status: 200 }
      );

      // Set HttpOnly cookie
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      { message: "Server error during login" },
      { status: 500 }
    );
  }
}
