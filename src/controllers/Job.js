import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import Job from "../models/Job.js";



// Add job Admin
export const addJobAdmin = asyncHandler(async (req, res) => {
    const job = await Job.create(req.body);
    res.json(job);
});

// get all jobs
export const getAllJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find();
    res.json(jobs);
});

// get job by id
export const getJobById = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    res.json(job);
});


// delete job by id
export const deleteJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job deleted", job });
});

// update job by id (id from body)
export const updateJob = asyncHandler(async (req, res) => {
    const { id, ...updateData } = req.body; // id alag nikala, baki fields update ke liye

    const job = await Job.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
});





