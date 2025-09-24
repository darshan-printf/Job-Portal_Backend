import mongoose from "mongoose";
import Company from "../models/Company.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";
import { sendEmail } from "../utils/email.js";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import imageToBase64 from "../utils/imageToBase64.js";


// Utility function to generate a random password
function generatePassword(length = 6) {
  let chars = "0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
// Company Registration
export const registerCompany = asyncHandler(async (req, res) => {
  const {
    name,
    address,
    email,
    phone,
    website,
    GSTNumber,
    PANNumber,
    type,
    CINNumber,
  } = req.body;

  if (
    !name ||
    !address ||
    !email ||
    !phone ||
    !website ||
    !GSTNumber ||
    !PANNumber ||
    !CINNumber ||
    !type
  ) {
    return res.status(400).json({
      success: false,
      message: `Please ${Object.keys(req.body)
        .filter((key) => !req.body[key])
        .join(", ")} fill required fields`,
    });
  }

  const logoPath = req.files?.logo ? req.files.logo[0].path : "";

  const company = await Company.create({
    name,
    address,
    email,
    phone,
    website,
    logo: logoPath,
    GSTNumber,
    PANNumber,
    CINNumber,
    isActive: false,
    type,
  });

  res.status(201).json({
    success: true,
    message:
      "Company registered successfully please wait 24 hours for approval",
  });
});
// Get All Companies
export const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find();

  const companiesWithBase64Logo = companies.map((company) => {
    return {
      ...company.toObject(),
      logo: company.logo ? imageToBase64(company.logo) : "",
    };
  });

  res.status(200).json({
    success: true,
    data: companiesWithBase64Logo,
  });
});

// Get Company By ID
export const getCompanyById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const company = await Company.findById(id);
  const companyWithBase64Logo = {
    ...company.toObject(),
    logo: company.logo ? imageToBase64(company.logo) : "",
  };
  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company not found",
    });
  }
  res.status(200).json({
    success: true,
    data: companyWithBase64Logo,
  });
});

// Add New Company
export const addCompany = asyncHandler(async (req, res) => {
  const {
    name,
    address,
    email,
    phone,
    website,
    GSTNumber,
    PANNumber,
    type,
    CINNumber,
    isActive,
  } = req.body;

  // get logo path
  const logo = req.files?.logo?.[0]?.path || "";

  // 1️⃣ Create company
  const company = await Company.create({
    name,
    address,
    email,
    phone,
    website,
    logo,
    GSTNumber,
    PANNumber,
    isActive: true,
    type,
    isActivatedOnce: false,
    CINNumber,
  });

  let message = "Company added successfully";

  // 2️⃣ If company should be active immediately -> create admin & send email
  if (isActive) {
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create admin for this company
    const user = await Admin.create({
      username: company.name.replace(/\s+/g, "") + "@1711",
        email: company.email,
        password: hashedPassword,
        role: "user",
        isActive: true,
        companyId: company._id,
        firstName : company.name,
        lastName : company.name,
        instituteName : company.name,
    });

    // Mark first activation
    company.isActivatedOnce = true;
    await company.save();

    // Send email
    await sendEmail(
      company.email,
      "Your Company Account Activated",
      `Hello ${company.name},\nYour account is now active.\n\nUsername: ${user.username}\nPassword: ${plainPassword}\n\nLogin and change your password immediately.`,
      `<h3>Hello ${company.name},</h3>
       <p>Your account has been <b>activated</b>.</p>
       <p><b>Username:</b> ${user.username}</p>
       <p><b>Password:</b> ${plainPassword}</p>
       <p>Please login and change your password immediately.</p>`
    );

    message = `Company added & activated successfully. Login details shared to ${company.email}`;
  }

  res.status(201).json({
    success: true,
    message,
    data: company,
  });
});

// Update Company
export const updateCompany = asyncHandler(async (req, res) => {
  const { id, ...restData } = req.body;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Company ID is required in body",
    });
  }
  const oldCompany = await Company.findById(id);
  if (!oldCompany) {
    return res.status(404).json({
      success: false,
      message: "Company not found",
    });
  }
  if (req.files && req.files.logo && req.files.logo.length > 0) {
    if (oldCompany.logo && fs.existsSync(oldCompany.logo)) {
      fs.unlinkSync(path.resolve(oldCompany.logo));
    }
    restData.logo = req.files.logo[0].path;
  }
  restData.updatedAt = Date.now();
  const company = await Company.findByIdAndUpdate(id, restData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: company,
    message: "Company updated successfully",
  });
});
// Delete Company
export const deleteCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if id is valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Company ID",
    });
  }

  // Check if company exists
  const company = await Company.findById(id);
  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company not found",
    });
  }

  // Check if any Admin is linked with this company
  const adminExists = await Admin.findOne({ companyId: id });
  if (adminExists) {
    return res.status(400).json({
      success: false,
      message:
        "Company cannot be deleted because users/admins are associated with it",
    });
  }

  // If no admin linked → delete company
  await Company.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Company deleted successfully",
  });
});

//  Company Activation
export const activateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const company = await Company.findById(id);
  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company not found",
    });
  }

  // Toggle activation
  company.isActive = !company.isActive;
  let message = "";

  if (company.isActive) {
    if (!company.isActivatedOnce) {
      // 🔹 First time activation logic

      const plainPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Create Admin for this company
      let user = new Admin({
        username: company.name.replace(/\s+/g, "") + "@1711",
        email: company.email,
        password: hashedPassword,
        role: "user",
        isActive: true,
        companyId: company._id,
        firstName : company.name,
        lastName : company.name,
        instituteName : company.name,
      });

      await user.save();

      // Mark first activation
      company.isActivatedOnce = true;

      // Send email only first time
      await sendEmail(
        company.email,
        "Your Company Account Activated",
        `Hello ${company.name},\nYour account is now active.\n\nUsername: ${user.username}\nPassword: ${plainPassword}\n\nLogin and change your password immediately.`,
        `<h3>Hello ${company.name},</h3>
         <p>Your account has been <b>activated</b>.</p>
         <p><b>Username:</b> ${user.username}</p>
         <p><b>Password:</b> ${plainPassword}</p>
         <p>Please login and change your password immediately.</p>`
      );

      message = `Company activated successfully, login details shared to ${company.email}`;
    } else {
      // 🔹 Reactivation logic (no new user, no email)
      await Admin.findOneAndUpdate(
        { email: company.email },
        { isActive: true }
      );
      message = `Company re-activated successfully (no new email sent)`;
    }
  } else {
    // Deactivation
    await Admin.findOneAndUpdate({ email: company.email }, { isActive: false });
    message = `Company deactivated successfully`;
  }

  await company.save();

  res.status(200).json({
    success: true,
    data: {
      message,
      isActive: company.isActive,
    },
  });
});

// get resently registered  5 companies
export const recentlyRegisteredCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort({ createdAt: -1 }).limit(5);
  const companiesWithBase64Logo = companies.map((company) => {
    return {
      ...company.toObject(),
      logo: company.logo ? imageToBase64(company.logo) : "",
    };
  });

  res.status(200).json({
    success: true,
    data: companiesWithBase64Logo,
  });
});
