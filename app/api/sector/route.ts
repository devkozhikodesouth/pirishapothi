import Sector from "@/app/models/sector";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sectors = await Sector.find({}).lean();

    return NextResponse.json(sectors, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching sectors:", error);

    return NextResponse.json(
      { message: "Failed to fetch sectors" },
      { status: 500 }
    );
  } 
}

