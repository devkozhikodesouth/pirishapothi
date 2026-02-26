import mongoose from "mongoose";

const sectorSchema = new mongoose.Schema({
    sectorName: { type: String, required: true },
    divisionId: { type: String, required: true } ,
    timeStamp: { type: Date, default: Date.now }   
});

const Sector =  mongoose.model("Sector", sectorSchema);
export default Sector;