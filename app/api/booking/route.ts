import { NextResponse } from "next/server";
import Booking from "@/app/models/booking";
import { connectDB } from "@/app/lib/mongodb";

export async function POST(request: Request) {
  try {
    await connectDB();

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

// app/api/admin/bookings/route.ts

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 30);
    const skip = (page - 1) * limit;

    const search = searchParams.get("search");
    const sector = searchParams.get("sector");
    const unit = searchParams.get("unit");

    const query: any = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
        { place: new RegExp(search, "i") },
      ];
    }
    if (sector) query.sector = sector;
    if (unit) query.unit = unit;

    const [data, total] = await Promise.all([
      Booking.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(query),
    ]);

    return NextResponse.json({
      data,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json(
      { message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}