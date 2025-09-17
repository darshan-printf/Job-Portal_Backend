import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import Inbox from "../models/Inbox.js";



// add inbox
export const addInbox = asyncHandler(async (req, res) => {
    const { name, email, message,subject } = req.body;
    const inbox = await Inbox.create({ name, email, message,subject });
    res.status(201).json(
        {
            success: true,
            message: "Inbox added successfully",
            inbox,
        }
    );
});

// get all inbox
export const getAllInbox = asyncHandler(async (req, res) => {
    const inbox = await Inbox.find({});
    res.json(inbox);
});