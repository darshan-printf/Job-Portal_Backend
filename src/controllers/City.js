import mongoose from "mongoose";
import City from "../models/City.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// carte  new state
export const createCity = asyncHandler(async (req, res) => {
    const { name, code, stateId } = req.body;
    const city = new City({ name, code, state: stateId });
    await city.save();
    res.status(201).json(city);
});

// get all states
export const getAllCitys = asyncHandler(async (req, res) => {
    const citys = await City.find({});
    res.json(citys);
});

// get state by id
export const getCityById = asyncHandler(async (req, res) => {
    const city = await City.findById(req.params.id);

    if (!city) {
        return res.status(404).json({ message: "City not found" });
    }

    res.json(city);
}); 

// update state by id

export const updateCity = asyncHandler(async (req, res) => {
    const { id,name, code } = req.body;
    const city = await City.findByIdAndUpdate(id, { name, code }, { new: true });
    if (!city) {
        return res.status(404).json({ message: "City not found" });
    }
    res.json(city);
});

// delete state by id
export const deleteCity = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid city ID " });
        }

    // Find and delete city
    const city = await City.findByIdAndDelete(id);

    if (!city) {
        return res.status(404).json({ message: "City not found" });
    }

    res.json({ message: "City deleted successfully" });
});

