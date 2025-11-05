import { asyncHandler } from "../utils/asyncHandler.js";
import Schedule from "../models/Schedule.js";
import Admin from "../models/Admin.js";
import { sendEmail } from "../utils/email.js";
import { interviewScheduledEmailTemplate } from "../mail/InterviewScheduledEmail.js";
import { interviewCancelledEmailTemplate } from "../mail/InterviewCancelledEmail.js";
import { interviewRejectedEmailTemplate } from "../mail/InterviewRejectedEmail.js";
import { offerLetterEmailTemplate } from "../mail/offerLetterEmail.js";

// update schedule
export const updateSchedule = asyncHandler(async (req, res) => {
  const scheduleId = req.params.id;
  const { interviewDate, status, remark } = req.body;


  // ✅ Find schedule and populate candidate info
  const schedule = await Schedule.findById(scheduleId).populate("candidateId").populate("jobId").populate("companyId");
  if (!schedule) {
    return res.status(404).json({ message: "Schedule not found" });
  }

const date = moment(interviewDate).format("dddd, MMM DD, YYYY");
const time = moment(interviewDate).format("hh:mm A");

  // ✅ If status is "scheduled", send interview email
  if (status === "scheduled" && schedule.candidateId?.email) {
    const { subject, text, html } = interviewScheduledEmailTemplate(
      schedule.candidateId.name,
      interviewDate,
      remark,
      schedule,
      date,
      time
    );

    try {
      await sendEmail(schedule.candidateId.email, subject, text, html);
    } catch (error) {
      console.error("Error sending interview scheduled email:", error);
    }
  }

  // If  status is "cancelled" , send email to candidate
  if (status === "cancelled" && schedule.candidateId?.email) {
    const { subject, text, html } = interviewCancelledEmailTemplate(
      schedule.candidateId.name,
      interviewDate,
      remark,
      schedule.companyId.name

    );

    try {
      await sendEmail(schedule.candidateId.email, subject, text, html);
    } catch (error) {
      console.error("Error sending interview cancelled email:", error);
    }
  }

  // If status is "rejected" , send email to candidate
  if (status === "rejected" && schedule.candidateId?.email) {
    const { subject, text, html } = interviewRejectedEmailTemplate(
      schedule.candidateId.name,
      interviewDate,
      remark,
      schedule,
      
      

    );

    try {
      await sendEmail(schedule.candidateId.email, subject, text, html);
    } catch (error) {
      console.error("Error sending interview rejected email:", error);
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
    interviewDate: schedule.interviewDate,
    date: schedule.date,
    time: schedule.time,
    status: schedule.status,
    note: schedule.note,
    createdAt: schedule.createdAt,
    remark: schedule.remark,
    updatedAt: schedule.updatedAt,
  }));

  res.status(200).json({
    message: "Schedules retrieved successfully",
    schedules: formattedSchedules,
  });
});

// get schedule by job id and get only accepted schedules
export const getScheduleById = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  // ✅ Find schedule and populate candidate info
  const schedule = await Schedule.find({jobId,status: { $in: ["accepted", "offered"] }}).populate("candidateId");
  if (!schedule) {
    return res.status(404).json({ message: "Schedule not found" });
  }
  
  // ✅ Flattened format
  const formattedSchedules = schedule.map((schedule) => ({
    _id: schedule._id,
    jobId: schedule.jobId?._id,
    candidateId: schedule.candidateId?._id,
    candidateName: schedule.candidateId?.name,
    candidateEmail: schedule.candidateId?.email,
    candidatePhone: schedule.candidateId?.phone,
    interviewDate: schedule.interviewDate,
    date: schedule.date,
    time: schedule.time,
    status: schedule.status,
    note: schedule.note,
    createdAt: schedule.createdAt,
    remark: schedule.remark,
    updatedAt: schedule.updatedAt,
  }));  
  
  res.status(200).json({
    message: "Schedules retrieved successfully",
    schedules: formattedSchedules,
  });
})
  
// send mail offer letter to candidate
export const sendOfferLetter = asyncHandler(async (req, res) => {
  const scheduleId = req.params.id;

  // ✅ Find schedule & populate related data
  const schedule = await Schedule.findById(scheduleId)
    .populate("candidateId")
    .populate("jobId")
    .populate("companyId");

  if (!schedule) {
    return res.status(404).json({ message: "Schedule not found" });
  }

  // ✅ Extract details
  const candidate = schedule.candidateId;
  const job = schedule.jobId;
  const company = schedule.companyId;

  const candidateName = candidate.name;
  const candidateEmail = candidate.email;
  const interviewDate = schedule.interviewDate;
  const remark = schedule.remark;
  const jobTitle = job.title;
  const jobField = job.field;
  const salary = job.salary;
  const companyName = company?.name || "Our Company";

  // ✅ Prepare email content
  const { subject, text, html } = offerLetterEmailTemplate({
    candidateName,
    jobTitle,
    jobField,
    salary,
    interviewDate,
    remark,
    companyName,
  });

  // ✅ Send email
  try {
    await sendEmail(candidateEmail, subject, text, html);

    // ✅ Update schedule status to 'offered'
    schedule.status = "offered";
    await schedule.save();

    res.status(200).json({
      message: "Offer letter email sent successfully",
      candidateId: candidate._id, // return only candidate id as per your need
    });
  } catch (error) {
    console.error("Error sending offer letter email:", error);
    res.status(500).json({ message: "Error sending offer letter email" });
  }
});




 
