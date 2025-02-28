import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import Education from "../models/Education.js";


// Add Education
export const addEducation = asyncHandler(async (req, res) => {
    const { degree, description } = req.body;
    const education = await Education.create({ degree, description });
    res.status(201).json(education);
});

// get all education
export const getAllEducation = asyncHandler(async (req, res) => {
    const educations = await Education.find({});
    res.json(educations);
});

// get education by id
export const getEducationById = asyncHandler(async (req, res) => {
    const education = await Education.findById(req.params.id);

    if (!education) {   
        return res.status(404).json({ message: "Education not found" });
    }

    res.json(education);
});

// update education by id
export const updateEducation = asyncHandler(async (req, res) => {
    const { degree, description } = req.body;
    const education = await Education.findByIdAndUpdate(req.body.id, { degree, description }, { new: true });

    if (!education) {   
        return res.status(404).json({ message: "Education not found" });
    }

    res.json(education);
});

// delete education by id
export const deleteEducation = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid education ID " });
    }

    // Find and delete education
    const education = await Education.findByIdAndDelete(id);

    if (!education) {
        return res.status(404).json({ message: "Education not found" });
    }

    res.json({ message: "Education deleted successfully" });
});