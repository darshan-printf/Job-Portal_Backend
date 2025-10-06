import Admin from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import Company from "../models/Company.js";
import imageToBase64 from "../utils/imageToBase64.js";
import fs from "fs";
import path from "path";

// add user
export const useAdd = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email, password, instituteName, companyId } = req.body;

  // Check required field
  if (!companyId) { return res.status(400).json({ message: "Company ID is required" });}

  // Validate ObjectId format
  if (!mongoose.isValidObjectId(companyId)) {return res.status(400).json({ message: "Invalid Company ID format" });}

  // Check if company exists
  const company = await Company.findById(companyId);
  if (!company) { return res.status(404).json({ message: "Company not found" });}

  // Check if company is active
  if (!company.isActive) {return res.status(400).json({ message: "Company is not active, cannot create user" });}

  // Check for existing username
  const usernameExists = await Admin.findOne({ username });
  if (usernameExists) { return res.status(400).json({ message: "Username already exists" });}

  // Check for existing email
  const emailExists = await Admin.findOne({ email });
  if (emailExists) {return res.status(400).json({ message: "Email already exists" });}

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Get image paths
  const profileImage = req.files?.profileImage?.[0]?.path || "";

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
    isActive: true,
    companyId,
  });
  await newAdmin.save();
  res.status(201).json({ message: "User created successfully", admin: newAdmin });
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
    isActive,
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

  // 🧹 Handle image replacement (delete old -> add new)
  const deleteOldFile = (filePath) => {
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error("Error deleting old file:", err);
    }
  };

  // Profile Image
  if (req.files?.profileImage?.[0]?.path) {
    deleteOldFile(user.profileImage); // delete old
    user.profileImage = req.files.profileImage[0].path; // save new
  }

  // Logo
  if (req.files?.logo?.[0]?.path) {
    deleteOldFile(user.logo); // delete old
    user.logo = req.files.logo[0].path; // save new
  }

  // Optional: Update isActive
  if (typeof isActive !== "undefined") {
    user.isActive = isActive;
  }

  await user.save();

  res.json({ message: "User updated successfully", user });
});

// delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1️⃣ Validate MongoDB ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  // 2️⃣ Find the user first
  const user = await Admin.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // 3️⃣ Optional: Delete profile image if exists (if you store image path)
  if (user.profileImage) {
    try {
      const imagePath = path.resolve(user.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("🗑️ Deleted user profile image:", imagePath);
      }
    } catch (err) {
      console.error("⚠️ Error deleting user profile image:", err.message);
    }
  }

  // 4️⃣ Delete user from DB
  await Admin.findByIdAndDelete(id);

  // 5️⃣ Respond
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: user,
  });
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