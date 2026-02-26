import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    // Clear the JWT cookie
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Expire immediately
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Server error during logout" },
      { status: 500 }
    );
  }
}
