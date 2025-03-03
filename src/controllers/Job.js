import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import Job from "../models/Job.js";


// get all jobs
export const getAllJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({});
    res.json(jobs);
});

// get jobs by user id
export const getJobsByUserId = asyncHandler(async (req, res) => {
    console.log(req,"reqwest");
    const jobs = await Job.find({ user: userId });
    res.json(jobs);
});

// get job by id
export const getJobById = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);  
});

// ADD Job
export const addJob = asyncHandler(async (req, res) => {
    const { user, Country, State, City, Education, title, description, experience, email, phone } = req.body;
    const job = await Job.create({ user, Country, State, City, Education, title, description, experience, email, phone });
    res.status(201).json(job);
});

// update job by id
export const updateJob = asyncHandler(async (req, res) => {
    const { user, Country, State, City, Education, title, description, experience, email, phone } = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, { user, Country, State, City, Education, title, description, experience, email, phone }, { new: true });
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
});

// delete job by id
export const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job deleted successfully" });

});


