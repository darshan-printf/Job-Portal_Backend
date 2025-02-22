import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true } ,
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true }
}, {timestamps: true});  // enable timestamps use createdAt and updatedAt
    
const City = mongoose.model("City", citySchema);
export default City;