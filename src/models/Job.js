import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    Country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    State: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    City: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    Education: { type: mongoose.Schema.Types.ObjectId, ref: 'Education', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    experience: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

}, {timestamps: true});  // enable timestamps use createdAt and updatedAt
    
const Job = mongoose.model("Job", jobSchema);
    