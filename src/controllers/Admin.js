import Admin from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from 'mongoose';

// admin update profile api

export const updateProfile = asyncHandler(async (req, res) => {
    const { id, firstName, lastName, username, email, instituteName } = req.body;
    // Ensure ID is provided
    if (!id) {
        return res.status(400).json({ message: 'Admin ID is required' });
    }

    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Admin ID format' });
    }
    // Find and update the admin profile
    const admin = await Admin.findByIdAndUpdate(
        id,
        { firstName, lastName, username, email, instituteName },
        { new: true, runValidators: true }
    ).exec();
    if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ message: 'Profile updated', admin });
});


// get admin by id 
export const getAdminById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Admin ID format' });
    }

    const admin = await Admin.findById(id);

    if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
});


