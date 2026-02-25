import mongoose from "mongoose";
import { connectDB } from "@/app/lib/mongodb";

await connectDB();
const unitSchema = new mongoose.Schema({
  unitName: { type: String, required: true },
  sectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sector",
    required: true,
  },
  divisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Division",
    required: true,
  },
  timeStamp: { type: Date, default: Date.now },
});

const Unit =  mongoose.models.Unit || mongoose.model("Unit", unitSchema);
export default Unit;