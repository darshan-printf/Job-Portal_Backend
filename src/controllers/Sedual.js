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

// get schedule 
export const getSchedule = asyncHandler(async (req, res) => {
  const adminId = req.admin._id;

  // ✅ Find Admin
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const companyId = admin.companyId;

  // ✅ Get all schedules with populated job and candidate
  const schedules = await Schedule.find({ companyId })
    .populate("jobId", "title package " )
    .populate("candidateId", " email phone name");

  if (!schedules || schedules.length === 0) {
    return res.status(404).json({ message: "Schedules not found" });
  }

  // ✅ Flattened format
  const formattedSchedules = schedules.map((schedule) => ({
    _id: schedule._id,
    jobId: schedule.jobId?._id,
    jobTitle: schedule.jobId?.title,
    candidateId: schedule.candidateId?._id,
    package: schedule.jobId?.package,
    candidateName: schedule.candidateId?.name,
    candidateEmail: schedule.candidateId?.email,
    candidatePhone: schedule.candidateId?.phone,
    date: schedule.date,
    time: schedule.time,
    status: schedule.status,
    note: schedule.note,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
  }));

  res.status(200).json({
    message: "Schedules retrieved successfully",
    schedules: formattedSchedules,
  });
});



