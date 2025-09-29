import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import Candidate from "../models/Candidate.js";


// apply job
export const applyJob = asyncHandler(async (req, res) => {
    const { name, email, phone, jobId, resume ,companyId} = req.body;
    const candidate = await Candidate.create({
        name,
        email,
        phone,
        jobId,
        resume : req.file.path,
        companyId,

        status: "pending",
    });
    res.status(201).json(
        {
            message: "Job applied successfully",
            candidate,
        }
    );
});

// get candidate by companyId
export const getCandidateByCompanyId = asyncHandler(async (req, res) => {
    const { admin } = req.admin._id;
   
   
   
    res.status(200).json(
        {
            message: "Candidates fetched successfully",
            candidates,
        }
    );
});




