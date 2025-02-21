import Admin from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';


// admin register api
export const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, username, email, password, instituteName } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin
    const newAdmin = new Admin({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,  // Store hashed password
        instituteName
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created', admin: newAdmin });
});

// admin login api
export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ username }).exec();
    if (!admin) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if password is provided
    if (!password) {
        return res.status(401).json({ message: 'Password is required' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({
        message: 'Login successful',
        id: admin._id,
        role: admin.role,
        token: token
    });
});

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

