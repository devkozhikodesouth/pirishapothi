import mongoose, { Schema, Document } from "mongoose";

/* -----------------------------
   TypeScript Interface
------------------------------ */

export interface BookingDocument extends Document {
  name: string;
  phone: string;
  place: string;
  orderCount: number;
  sector: string;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
}

/* -----------------------------
   Schema
------------------------------ */

const bookingSchema = new Schema<BookingDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    orderCount: {
      type: Number,
      required: true,
      min: 1,
    },
    sector: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

/* -----------------------------
   Model (Next.js Safe)
------------------------------ */

const Booking =
  mongoose.models.Booking ||
  mongoose.model<BookingDocument>("Booking", bookingSchema);

export default Booking;