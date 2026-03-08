import { NextResponse } from "next/server";
import Booking from "@/app/models/booking";
import { connectDB } from "@/app/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const today = searchParams.get("today");

    await connectDB();

    const pipeline: any[] = [];
    const matchStage: any = {};

    if (today === "true") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      matchStage.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      {
        $group: {
          _id: "$sector",
          totalBookings: { $sum: 1 },
          totalOrders: { $sum: "$orderCount" },
        },
      },
      {
        $project: {
          _id: 0,
          sector: "$_id",
          totalBookings: 1,
          totalOrders: 1,
        },
      },
      {
        $sort: { sector: 1 }, 
      }
    );

    const data = await Booking.aggregate(pipeline);

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
