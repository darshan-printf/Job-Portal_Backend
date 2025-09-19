import Admin from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

// admin register api
export const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, username, email, password, instituteName } = req.body;
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
        return res.status(400).json({ message: 'An admin already exists. Only one admin is allowed.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdmin = new Admin({
        firstName,
        lastName,
        username,
        email,
        isActive : true,
        password: hashedPassword,
        instituteName,
        profileImage: req.files?.profileImage?.[0]?.path || "",

    });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created', admin: newAdmin });
});
// login api
export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: username.trim() }).exec();
    if (!admin) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    if (!password) {
        return res.status(401).json({ message: 'Password is required' });
    }
    if (!admin.isActive) {
        return res.status(401).json({ message: 'User is not active' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.status(200).json({
        message: 'Login successful',
        id: admin._id,
        role: admin.role,
        token: token
    });
});