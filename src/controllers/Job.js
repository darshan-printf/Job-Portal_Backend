import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import Job from "../models/Job.js";
import imageToBase64 from "../utils/imageToBase64.js";



// Add job Admin
export const addJobAdmin = asyncHandler(async (req, res) => {
    const job = await Job.create(req.body);
    res.json(job);
});

export const getAllJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find()
        .select("title  experience salary type  ")
        .populate("country", "name")
        .populate("state", "name")
        .populate("city", "name")

    // convert populated objects into plain strings
    const formattedJobs = jobs.map(job => ({
        _id: job._id,
        title: job.title,
        experience: job.experience,
        salary: job.salary,
        type: job.type,
        country: job.country?.name || null,
        state: job.state?.name || null,
        city: job.city?.name || null
    }));

    res.json(formattedJobs);
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





