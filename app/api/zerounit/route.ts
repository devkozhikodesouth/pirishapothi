import { NextResponse } from "next/server";
import Booking from "@/app/models/booking";
import Unit from "@/app/models/unit";
import Sector from "@/app/models/sector";
import { connectDB } from "@/app/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    await connectDB();

    const bookingMatchQuery: any = {};

    // Get all units that have bookings
    const unitsWithBookings = await Booking.distinct("unit", bookingMatchQuery);

    // Get all units and populate sector
    const allUnits = await Unit.find({}).populate({
      path: "sectorId",
      model: Sector,
      select: "sectorName",
    }).lean();

    // Filter units that are NOT in unitsWithBookings
    const zeroUnits = allUnits
      .filter((u: any) => !unitsWithBookings.includes(u.unitName))
      .map((u: any) => ({
        unit: u.unitName,
        sector: u.sectorId?.sectorName || "Unknown",
      }));

    // Sort by sector, then unit
    zeroUnits.sort((a, b) => {
      if (a.sector === b.sector) {
        return a.unit.localeCompare(b.unit);
      }
      return a.sector.localeCompare(b.sector);
    });

    return NextResponse.json(
      { message: "Zero unit data fetched successfully", data: zeroUnits },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Zero unit fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch zero unit data", error: error.message },
      { status: 500 }
    );
  }
}
