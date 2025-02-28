import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    degree: { type: String, required: true },
    description: { type: String, required: true },
}, {timestamps: true});  // enable timestamps use createdAt and updatedAt
    
const Education = mongoose.model("Education", educationSchema);
export default Education;