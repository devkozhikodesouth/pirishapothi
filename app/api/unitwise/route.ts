import { NextResponse } from "next/server";
import Booking from "@/app/models/booking";
import { connectDB } from "@/app/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const data = await Booking.aggregate([
      {
        $group: {
          _id: "$unit",
          totalBookings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          unit: "$_id",
          totalBookings: 1,
        },
      },
      {
        $sort: { unit: 1 }, 
      },
    ]);

    return NextResponse.json(
      { message: "Unit-wise data fetched successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unit-wise aggregation error:", error);
    return NextResponse.json(
      { message: "Failed to fetch unit-wise data" },
      { status: 500 }
    );
  }
}
