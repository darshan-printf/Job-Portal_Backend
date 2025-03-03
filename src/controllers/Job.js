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
    
    const userId = req.admin._id;// Get userId from request parameters
   
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const jobs = await Job.find({ user: userId });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
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
    const { Country, State, City, Education, title, description, experience, email, phone } = req.body;
    const userId = req.admin._id; // Get the logged-in admin's ID

    try {
        const job = await Job.create({
            user: userId, // Automatically assign logged-in admin's ID
            Country,
            State,
            City,
            Education,
            title,
            description,
            experience,
            email,
            phone
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
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


