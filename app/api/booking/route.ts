import { NextResponse } from "next/server";
import Booking from "@/app/models/booking";

export async function POST(request: Request) {
  try {

    const body = await request.json();
    console.log("Booking payload:", body);

    const { name, phone, place, orderCount, sector, unit } = body;

    // ✅ Correct validation
    if (
      !name ||
      !phone ||
      !place ||
      !sector ||
      !unit ||
      typeof orderCount !== "number" ||
      orderCount <= 0
    ) {
      return NextResponse.json(
        { message: "All fields are required and orderCount must be > 0" },
        { status: 400 }
      );
    }

    const booking = await Booking.create({
      name,
      phone,
      place,
      orderCount,
      sector,
      unit,
    });

    return NextResponse.json(
      { message: "Booking created successfully", data: booking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);

    return NextResponse.json(
      { message: "Failed to create booking" },
      { status: 500 }
    );
  }
}