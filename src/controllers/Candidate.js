import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import Candidate from "../models/Candidate.js";
import Admin from "../models/Admin.js";
import { sendEmail } from "../utils/email.js";
import { rejectionEmailTemplate } from "../mail/rejectionEmailTemplate.js";



// apply job
export const applyJob = asyncHandler(async (req, res) => {
  const { name, email, phone, jobId, resume, companyId } = req.body;
  const candidate = await Candidate.create({
    name,
    email,
    phone,
    jobId,
    resume: req.file.path,
    companyId,
    status: "pending",
  });
  res.status(201).json({
    message: "Job applied successfully",
    candidate,
  });
});

// get candidate by companyId
export const getCandidateByCompanyId = asyncHandler(async (req, res) => {
  try {
    const adminId = req.admin._id;

    // Admin ka detail
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const companyId = admin.companyId;

    // Candidate with job detail
    let candidates = await Candidate.find({ companyId }).populate({
      path: "jobId",
      select: "title package",
    });

    if (!candidates || candidates.length === 0) {
      return res
        .status(404)
        .json({ message: "No candidates found for this company" });
    }

    // ✅ Resume ka full URL add karna
    const baseUrl = process.env.BASE_URL;
    candidates = candidates.map((c) => {
      return {
        ...c._doc,
        resume: c.resume ? `${baseUrl}/${c.resume}` : null,
      };
    });

    res.status(200).json({
      message: "Candidates fetched successfully",
      candidates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get candidate by id
export const getCandidateById = asyncHandler(async (req, res) => {
  const candidateId = req.params.id;

  const candidate = await Candidate.findById(candidateId);
  const baseUrl = process.env.BASE_URL;
  candidate.resume = candidate.resume ? `${baseUrl}/${candidate.resume}` : null;
  
  if (!candidate) {
    return res.status(404).json({ message: "Candidate not found" });
  }
  res.status(200).json({
    message: "Candidate fetched successfully",
    candidate,
  });
});

// change candidate status
export const changeCandidateStatus = asyncHandler(async (req, res) => {
  const { candidateId, status } = req.body; // 👈 id aur status dono body se

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) {
    return res.status(404).json({ message: "Candidate not found" });
  }

  // Allowed statuses
  const allowedStatuses = ["pending", "scheduled", "rejected"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  candidate.status = status;
  await candidate.save();

 // Rejection case handle with template
  if (status === "rejected") {
    const { subject, text, html } = rejectionEmailTemplate(candidate.name);

    try {
      await sendEmail(candidate.email, subject, text, html);
    } catch (error) {
      console.error("Error sending rejection email:", error);
    }
  }

  res.status(200).json({
    message: "Candidate status updated successfully",
    candidate,
  });
});

//  get list of candidate status scheduled
export const getScheduledCandidates = asyncHandler(async (req, res) => {
  const adminId = req.admin._id;
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }
  const companyId = admin.companyId;
  // Candidate with job detail 
  const candidates = await Candidate.find({ companyId, status: "scheduled" }).populate({
    path: "jobId",
    select: "title package",
  });
  if (!candidates || candidates.length === 0) {
    return res.status(404).json({ message: "No candidates found" });
  }
  res.status(200).json({
    message: "Scheduled candidates fetched successfully",
    candidates,
  });
});
