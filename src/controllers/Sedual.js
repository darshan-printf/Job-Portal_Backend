import { asyncHandler } from "../utils/asyncHandler.js";
import Schedule from "../models/Schedule.js";
import Admin from "../models/Admin.js";

// add schedule
export const addSchedule = asyncHandler(async (req, res) => {
  const adminId = req.admin._id;
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }
  // one schedule per candidate
  if(candidateId){
    const existingSchedule = await Schedule.findOne({ candidateId });
    if (existingSchedule) {
      return res.status(400).json({ message: "Schedule already exists for this candidate" });
    }
  }
  const companyId = admin.companyId;
  const schedule = await Schedule.create({
    companyId: companyId,
    jobId: req.body.jobId,
    candidateId: req.body.candidateId,
    interviewDate: req.body.interviewDate,
    status: req.body.status,
    remark: req.body.remark,
  });

  res.status(201).json({
    message: "Schedule added successfully",
    schedule,
  });
});



