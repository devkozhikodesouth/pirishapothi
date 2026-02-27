import mongoose from "mongoose";
import Booking from "./app/models/booking";
import { connectDB } from "./app/lib/mongodb";

const MONGODB_URI = "mongodb+srv://shafeequesland:pirishapothi@cluster0.yi40vcd.mongodb.net/?appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI as string);
  const items = await Booking.find({});
  console.log("Total Bookings in DB:", items.length);
  items.forEach(doc => {
      console.log(`- Sector: ${doc.sector}, orderCount: ${doc.orderCount} (Type: ${typeof doc.orderCount})`);
  });
  process.exit(0);
}

run().catch(console.error);
