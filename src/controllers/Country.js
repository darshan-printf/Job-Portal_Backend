import Country from "../models/Country.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new country
export const createCountry = asyncHandler(async (req, res) => {
    const { name, code } = req.body;
    const country = new Country({ name, code });
    await country.save();
    res.status(201).json(country);
});

// Get all countries
export const getAllCountries = asyncHandler(async (req, res) => {
    const countries = await Country.find({});
    res.json(countries);

});

// Get a single country by ID
export const getCountryById = asyncHandler(async (req, res) => {
    const country = await Country.findById(req.params.id);

    if (!country) {
        return res.status(404).json({ message: "Country not found" });
    }

    res.json(country);
});


// Update a country by ID
export const updateCountry = asyncHandler(async (req, res) => {
    const { id,name, code } = req.body;
    const country = await Country.findByIdAndUpdate(id, { name, code }, { new: true });
    if (!country) {
        return res.status(404).json({ message: "Country not found" });
    }
    res.json(country);
});

