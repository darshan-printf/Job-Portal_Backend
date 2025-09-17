import { asyncHandler } from "../utils/asyncHandler.js";
import Feedback from "../models/Feedback.js";

// add feedback
export const addFeedback = asyncHandler(async (req, res) => {
    const { name, email, message, rating } = req.body;
    const feedback = await Feedback.create({ name, email, message, rating });
    res.status(201).json(
        {
            success: true,
            message: "Feedback added successfully",
            feedback,
        }
    );
});

// get all feedback
export const getAllFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find({});
    res.json(feedback);
});