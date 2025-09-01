import mongoose from "mongoose";
import Company from "../models/Company.js";
import { asyncHandler } from "../utils/asyncHandler.js";


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

// Add New Company
export const addCompany = asyncHandler(async (req, res) => {
    const { name, address, email, phone, website, GSTNumber, PANNumber, isActive, type } = req.body;

    // get logo path
    const logo = req.files?.logo?.[0]?.path || '';

    const company = await Company.create({
        name,
        address,
        email,
        phone,
        website,
        logo,
        GSTNumber,
        PANNumber,
        isActive,
        type
    });

    res.status(201).json({
        success: true,
        data: company
    });
});

// Get All Companies
export const getAllCompanies = asyncHandler(async (req, res) => {
    const companies = await Company.find();
    res.status(200).json({
        success: true,
        data: companies
    });
});

// Get Company By ID
export const getCompanyById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) {
        return res.status(404).json({
            success: false,
            message: "Company not found"
        });
    }
    res.status(200).json({
        success: true,
        data: company
    });
});

// Update Company
export const updateCompany = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const company = await Company.findByIdAndUpdate(id, req.body, { new: true });
    if (!company) {
        return res.status(404).json({
            success: false,
            message: "Company not found"
        });
    }
    res.status(200).json({
        success: true,
        data: company
    });
});

// Delete Company
export const deleteCompany = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
        return res.status(404).json({
            success: false,
            message: "Company not found"
        });
    }
    res.status(200).json({
        success: true,
        message: "Company deleted successfully"
    });
});

// Company Registration
export const registerCompany = asyncHandler(async (req, res) => {
    const { name, address, email, phone, website, logo, GSTNumber, PANNumber, isActive, type, CINNumber } = req.body;
    if (!name || !address || !email || !phone || !website || !GSTNumber || !PANNumber || !CINNumber || !type) {
        return res.status(400).json({
            success: false,
            message: `Please ${Object.keys(req.body).filter(key => !req.body[key]).join(", ")} fill  required fields`
        });
    }
    const company = await Company.create({
        name,
        address,
        email,
        phone,
        website,
        logo,
        GSTNumber,
        PANNumber,
        CINNumber,
        isActive: false,
        type
    });

    res.status(201).json({
        success: true,
        message: "Company registered successfully please wait 24 hours for approval"
    });
});

//  Company Activation
export const activateCompany = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const company = await Company.findByIdAndUpdate(id, { isActive: true }, { new: true });
    if (!company) {
        return res.status(404).json({
            success: false,
            message: "Company not found"
        });
    }
    res.status(200).json({
        success: true,
        data: company
    });
});
