import { asyncHandler } from "../utils/asyncHandler.js";
import Schedule from "../models/Schedule.js";
import Admin from "../models/Admin.js";
import { sendEmail } from "../utils/email.js";
import { interviewScheduledEmailTemplate } from "../mail/InterviewScheduledEmail.js";

// update schedule
export const updateSchedule = asyncHandler(async (req, res) => {
  const scheduleId = req.params.id;
  const { interviewDate, status, remark } = req.body;

  // ✅ Find schedule and populate candidate info
  const schedule = await Schedule.findById(scheduleId).populate("candidateId");
  if (!schedule) {
    return res.status(404).json({ message: "Schedule not found" });
  }

  // ✅ If status is "scheduled", send interview email
  if (status === "scheduled" && schedule.candidateId?.email) {
    const { subject, text, html } = interviewScheduledEmailTemplate(
      schedule.candidateId.name,
      interviewDate,
      remark
    );

    try {
      await sendEmail(schedule.candidateId.email, subject, text, html);
    } catch (error) {
      console.error("Error sending interview scheduled email:", error);
    }
  }

  // ✅ Update fields
  if (interviewDate) schedule.interviewDate = interviewDate;
  if (status) schedule.status = status;
  if (remark) schedule.remark = remark;

  // ✅ Save updated schedule
  await schedule.save();

  res.status(200).json({
    message: "Schedule updated successfully",
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



