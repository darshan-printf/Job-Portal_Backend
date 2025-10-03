import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  interviewDate: { type: Date, required: false },
  remark: { type: String, default: "" },
  status: { type: String, enum: ["scheduled", "completed", "cancelled" ,"rejected" ,"accepted"], default: "scheduled" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
