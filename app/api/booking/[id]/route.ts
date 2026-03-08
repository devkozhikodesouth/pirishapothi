import { NextResponse } from "next/server";
import Booking from "@/app/models/booking";
import { connectDB } from "@/app/lib/mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Booking deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete booking error:", error);
    return NextResponse.json(
      { message: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
