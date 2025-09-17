import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: false },
    title: { type: String, required: true },
    description: { type: String, required: true },
    experience: { type: String, required: true },
    field: { type: String, required: false }, 
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    salary: { type: Number, required: false },
    workingHours: { type: String, required: false },
    type: { type: String, required: true }, 
    skills: { type: String, required: false },
    tool: { type: String, required: false },
    flexibleWorkingHours: { type: Boolean, required: true }, 
    shift: { type: String, required: false },
    bondTime: { type: String, required: false },
    bondDescription: { type: String, required: false },
    noticePeriod: { type: String, required: false },
    benefits: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },   
}, {timestamps: true});
    
const Job = mongoose.model("Job", jobSchema);

export default Job;
    