import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    flag: { type: String }, 
}, {timestamps: true});  // enable timestamps use createdAt and updatedAt
    
const Country = mongoose.model("Country", countrySchema);
export default Country;
