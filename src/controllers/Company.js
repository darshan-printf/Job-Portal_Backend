import mongoose from "mongoose";
import Company from "../models/Company.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";
import { sendEmail } from "../utils/email.js";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

// Utility function to convert image file to base64
const imageToBase64 = (filePath) => {
  try {
    const fullPath = path.resolve(filePath);
    const file = fs.readFileSync(fullPath);
    const mimeType = path.extname(fullPath).slice(1);
    return `data:image/${mimeType};base64,${file.toString("base64")}`;
  } catch (err) {
    return "";
  }
};
// Utility function to generate a random password
function generatePassword(length = 6) {
  let chars =
    "0123456789";
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
    isActive,
    type,
  } = req.body;

  // get logo path
  const logo = req.files?.logo?.[0]?.path || "";

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
    type,
  });

  res.status(201).json({
    success: true,
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
  });
});

// Delete Company
export const deleteCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const company = await Company.findByIdAndDelete(id);
  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company not found",
    });
  }
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

  // Toggle status
  company.isActive = !company.isActive;
  let message = "";

  if (company.isActive) {
    // Generate password
    const plainPassword = generatePassword(); // e.g. 6-digit random
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Save hashed password in company
    company.password = hashedPassword;

    // ---- Create/Update User in Admin collection ----
    let user = await Admin.findOne({ email: company.email });
    if (!user) {
      // Create new user if not exists
      user = new Admin({
        username: company.name, // or any unique field
        password: hashedPassword,
        role: "user", // company = user
        isActive: true,
        companyId: company._id,
      });
    } else {
      // Update if already exists
      user.password = hashedPassword;
      user.isActive = true;
    }
    await user.save();

    // ---- Send Email ----
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
    // If deactivate → user bhi inactive kar do
    await Admin.findOneAndUpdate(
      { email: company.email },
      { isActive: false }
    );
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
