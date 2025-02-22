import Admin from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// admin update profile api

export const updateProfile = asyncHandler(async (req, res) => {
    const { id, firstName, lastName, username, email, instituteName } = req.body;
    // Ensure ID is provided
    if (!id) {
        return res.status(400).json({ message: 'Admin ID is required' });
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

