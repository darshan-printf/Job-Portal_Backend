import Admin from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

// user api
// get all users
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await Admin.find({ role: "user" }).exec();
    res.json(users);
});

// get user by id
export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid User ID " });
    }

    const user = await Admin.findById(id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
});

// update user
export const updateUser = asyncHandler(async (req, res) => {
    const { id, firstName, lastName, username, password, email, instituteName } = req.body; // Get id from body
    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }
    const user = await Admin.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.password = hashedPassword;
    user.email = email;
    user.instituteName = instituteName;
    await user.save();
    res.json({ message: "User updated", user });
});
// delete user
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await Admin.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted", user });
});