import Admin from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import imageToBase64 from "../utils/imageToBase64.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// update admin profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { id, firstName, lastName, username, email, instituteName } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Admin ID is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Admin ID format" });
  }

  const profileImagePath = req.files?.profileImage?.[0]?.path || null;

  const existingAdmin = await Admin.findById(id).exec();
  if (!existingAdmin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const updateData = {
    firstName,
    lastName,
    username,
    email,
    instituteName,
    
  };

  if (profileImagePath) {
    // normalize relative path for DB (uploads/filename.png)
    const relativePath = path.join("uploads", path.basename(profileImagePath));

    // delete old image if exists
    if (existingAdmin.profileImage) {
      const oldImagePath = path.join(process.cwd(), existingAdmin.profileImage);
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (err) {
          // silently ignore error
        }
      }
    }

    updateData.profileImage = relativePath;
  }

  const admin = await Admin.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).exec();

  res.json({
    success: true,
    message: "Profile updated",
    data: admin,
    profileImage: admin.profileImage
      ? imageToBase64(path.join(process.cwd(), admin.profileImage))
      : "",
    firstName: admin.firstName,
    lastName: admin.lastName,
  });
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
  adminObj.profileImage =  imageToBase64(admin.profileImage);
  

  res.json(adminObj);
});

// change admin password
export const changePassword = asyncHandler(async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  if (!id || !oldPassword || !newPassword) {
    return res
      .status(400)
      .json({
        message: "Admin ID, old password and new password are required",
      });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Admin ID format" });
  }
  const admin = await Admin.findById(id).select("+password"); // ensure password field is included
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }
  const isMatch = await bcrypt.compare(oldPassword, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(newPassword, salt);
  await admin.save();
  res.json({
    success: true,
    message: "Password changed successfully",
  });
});

// Get chat details for usre and admin
export const getAdminDetails = asyncHandler(async (req, res) => {
  const UserId = req.admin?._id;

  if (!UserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ✅ Main admin
  const mainAdmin = await Admin.findOne({ role: "admin" }).select("-password -__v");
  if (!mainAdmin) {
    return res.status(404).json({ message: "Main admin not found" });
  }

  // ✅ Current user
  const User = await Admin.findById(UserId).select("-password -__v");
  if (!User) {
    return res.status(404).json({ message: "User not found" });
  }

  // ✅ Convert admin to plain object then inject base64
  const adminObj = mainAdmin.toObject();
  adminObj.profileImage = imageToBase64(mainAdmin?.profileImage);

  // ✅ Convert user to plain object then inject base64
  const UserObj = User.toObject();
  UserObj.profileImage = imageToBase64(User?.profileImage);

  // ✅ Send both objects
  res.status(200).json({
    success: true,
    admin: adminObj,
    User: UserObj,
  });
});

