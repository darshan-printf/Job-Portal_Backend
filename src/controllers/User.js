import Admin from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

// Utility function to convert image file to base64
const imageToBase64 = (filePath) => {
    try {
        const fullPath = path.resolve(filePath); // resolve to absolute path
        const file = fs.readFileSync(fullPath);
        const mimeType = path.extname(fullPath).slice(1); // e.g., jpg, png
        return `data:image/${mimeType};base64,${file.toString('base64')}`;
    } catch (err) {
        return ''; // fallback if image not found
    }
};

// add user
export const useAdd = asyncHandler(async (req, res) => {
    const { firstName, lastName, username, email, password, instituteName } = req.body;
    // Check for existing username
    const usernameExists = await Admin.findOne({ username });
    if (usernameExists) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    // Check for existing email
    const emailExists = await Admin.findOne({ email });
    if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Get image paths
    const profileImage = req.files?.profileImage?.[0]?.path || '';
    const logo = req.files?.logo?.[0]?.path || '';

    // Create new admin
    const newAdmin = new Admin({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        instituteName,
        role: "user",
        profileImage,
        logo,
        isActive:"true" // default to true if not provided
    });

    await newAdmin.save();
    res.status(201).json({ message: 'User created', admin: newAdmin });
});

// get all users
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await Admin.find({ role: "user" }).select("-password -__v").exec();

    const usersWithBase64Images = users.map(user => {
        return {
            ...user.toObject(),
            profileImage: user.profileImage ? imageToBase64(user.profileImage) : '',
            logo: user.logo ? imageToBase64(user.logo) : ''
        };
    });

    res.json(usersWithBase64Images);
});

// get user by id
export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await Admin.findById(id).select("-password -__v");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const userObj = user.toObject();

    // Add base64 image data
    userObj.profileImage = user.profileImage ? imageToBase64(user.profileImage) : '';
    userObj.logo = user.logo ? imageToBase64(user.logo) : '';

    res.json(userObj);
});

// update user
export const updateUser = asyncHandler(async (req, res) => {
    const {
        id,
        firstName,
        lastName,
        username,
        password,
        email,
        instituteName,
        isActive
    } = req.body;

    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const user = await Admin.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Update basic fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.instituteName = instituteName || user.instituteName;

    // Optional: Update password only if provided
    if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
    }

    // Optional: Update profileImage and logo if uploaded
    if (req.files?.profileImage?.[0]?.path) {
        user.profileImage = req.files.profileImage[0].path;
    }
    if (req.files?.logo?.[0]?.path) {
        user.logo = req.files.logo[0].path;
    }

    // Optional: Update isActive
    if (typeof isActive !== "undefined") {
        user.isActive = isActive;
    }

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


// user Active & Deactive
export const activeStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await Admin.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: "User status updated", user });
});