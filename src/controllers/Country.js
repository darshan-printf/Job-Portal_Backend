import Country from "../models/Country.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import State from "../models/States.js";
import fs from "fs";
import path from "path";
import imageToBase64 from "../utils/imageToBase64.js";

// Create a new country
export const createCountry = asyncHandler(async (req, res) => {
    const { name, code } = req.body;
    const flag = req.files?.flag?.[0]?.path || "";
    const country = new Country({ name, code, flag });
    await country.save();
    res.status(201).json({
      success: true,
      data: country,
      message: "Country added successfully",
    });
});

// Get all countries
export const getAllCountries = asyncHandler(async (req, res) => {
  const countries = await Country.find({});

  // ✅ map over countries (the result array), not Country (the model)
  const countriesWithFlag = countries.map((country) => ({
    ...country.toObject(),
    flag: country.flag ? imageToBase64(country.flag) : "",
  }));

  res.status(200).json({
    success: true,
    data: countriesWithFlag,
  });
});

// Get a single country by ID
export const getCountryById = asyncHandler(async (req, res) => {
  const country = await Country.findById(req.params.id);
  if (!country) {
    return res.status(404).json({ message: "Country not found" });
  }

  // ✅ Only one document, no need to map
  const countryWithFlag = {
    ...country.toObject(),
    flag: country.flag ? imageToBase64(country.flag) : "",
  };

  res.status(200).json({
    success: true,
    data: countryWithFlag,
  });
});


// Update a country by ID
export const updateCountry = asyncHandler(async (req, res) => {
  const { id, name, code } = req.body;

  // Check if country exists
  const country = await Country.findById(id);
  if (!country) {
    return res.status(404).json({ message: "Country not found" });
  }

  // If new flag is uploaded
  if (req.files?.flag?.[0]?.path) {
    // remove old flag file if exists
    if (country.flag && fs.existsSync(country.flag)) {
      fs.unlinkSync(path.resolve(country.flag));
    }
    country.flag = req.files.flag[0].path;
  }

  // Update name and code
  country.name = name || country.name;
  country.code = code || country.code;

  await country.save();

  res.json({
    success: true,
    data: country,
    message: "Country updated successfully",
  });
});



// Delete a country by ID
export const deleteCountry = asyncHandler(async (req, res) => {
    const country = await Country.findById(req.params.id);
    if (!country) {
        return res.status(404).json({ message: "Country not found" });
    }
    // Check if any states reference this country
    const relatedStates = await State.find({ country: req.params.id });


    if (relatedStates.length > 0) {
        return res.status(400).json({ message: "Cannot delete country with related states. Delete related states first." });
    }

    // Delete the country
    await Country.findByIdAndDelete(req.params.id);

    res.json({ message: "Country deleted successfully" });
});



