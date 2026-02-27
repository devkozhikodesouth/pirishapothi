import { NextResponse } from "next/server";
import Booking from "@/app/models/booking";
import { connectDB } from "@/app/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const data = await Booking.aggregate([
      {
        $group: {
          _id: "$sector",
          totalBookings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          sector: "$_id",
          totalBookings: 1,        },
      },
      {
        $sort: { sector: 1 }, 
      },
    ]);

    return NextResponse.json(
      { message: "Sector-wise data fetched successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sector-wise aggregation error:", error);
    return NextResponse.json(
      { message: "Failed to fetch sector-wise data" },
      { status: 500 }
    );
  }
}
