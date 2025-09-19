import Admin from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import imageToBase64 from "../utils/imageToBase64.js";

// admin update profile api
export const updateProfile = asyncHandler(async (req, res) => {
  const { id, firstName, lastName, username, email, instituteName } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Admin ID is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Admin ID format" });
  }

  // agar nayi image aayi hai to path lo
  const profileImage = req.files?.profileImage?.[0]?.path || null;

  const updateData = {
    firstName,
    lastName,
    username,
    email,
    instituteName,
  };

  // agar image mili hai to purani replace karo
  if (profileImage) {
    updateData.profileImage = profileImage;
  }

  const admin = await Admin.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).exec();

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  res.json({ message: "Profile updated", admin });
});

// get admin by id
export const getAdminById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Admin ID format" });
  }

  const admin = await Admin.findById(id).select("-password -__v");

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const adminObj = admin.toObject();

  // Convert images to base64 if available
  adminObj.profileImage = admin.profileImage ? imageToBase64(admin.profileImage) : '';
  adminObj.logo = admin.logo ? imageToBase64(admin.logo) : '';

  res.json(adminObj);
});


