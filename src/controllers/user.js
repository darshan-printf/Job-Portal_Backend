import User from "../models/user.modal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, instituteName } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        instituteName
    });
    await newUser.save();
    res.status(201).json({ message: 'User created', user: newUser });
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "8h", // Token expiration time
    });
};
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const token = generateToken(user._id);

    res.status(200).json({
        message: "Login successful",
        token,  // Return the JWT token
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
});

// list api to get all users
export const listUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

//  user Edit api api data are same to no 

export const editUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, instituteName, password } = req.body;
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(userId, {
        firstName,
        lastName,
        email,
        instituteName,
        password
    }, { new: true });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
});

// user get by id
export const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
});

// user delete api
export const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
});






