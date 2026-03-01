import { NextResponse } from "next/server";
import Booking from "@/app/models/booking";
import { connectDB } from "@/app/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sector = searchParams.get("sector");

    await connectDB();

    const pipeline: any[] = [];

    if (sector) {
      pipeline.push({ $match: { sector } });
    }

    pipeline.push(
      {
        $group: {
          _id: "$unit",
          totalBookings: { $sum: 1 },
          totalOrders: { $sum: "$orderCount" },
        },
      },
      {
        $project: {
          _id: 0,
          unit: "$_id",
          totalBookings: 1,
          totalOrders: 1,
        },
      },
      {
        $sort: { unit: 1 }, 
      }
    );

    const data = await Booking.aggregate(pipeline);

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
