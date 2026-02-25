import { NextResponse } from "next/server";
import Sector from "@/app/models/sector";
import Unit from "@/app/models/unit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sectorName: string }> }
) {
  try {


    // ✅ IMPORTANT: unwrap params first
    const { sectorName } = await params;
    console.log(sectorName)

    // 1️⃣ Find sector
    const sector = await Sector.findOne({ sectorName });

    if (!sector) {
      return NextResponse.json(
        { message: "Sector not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Find units for sector
    const units = await Unit.find({ sectorId: sector._id });

    if (units.length === 0) {
      return NextResponse.json(
        { message: "No units found for this sector" },
        { status: 404 }
      );
    }

    return NextResponse.json(units, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching units:", error.message);

    return NextResponse.json(
      { message: "Failed to fetch units" },
      { status: 500 }
    );
  }
}