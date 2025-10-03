import { asyncHandler } from "../utils/asyncHandler.js";
import Schedule from "../models/Sedual.js";
import Admin from "../models/Admin.js";

// add schedule
export const addSchedule = asyncHandler(async (req, res) => {
  const adminId = req.admin._id;
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
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



