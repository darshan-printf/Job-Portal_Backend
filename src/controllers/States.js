import State from "../models/States.js";
import City from "../models/City.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import imageToBase64 from "../utils/imageToBase64.js";
import mongoose from "mongoose";

// carte  new state 
export const createState = asyncHandler(async (req, res) => {
    const { name, code, countryId } = req.body;
    const state = await State.create({ name, code, country: countryId });
    if (!countryId) {
        return res.status(404).json({ message: "Country not found" });
    }
    res.status(201).json({
      success: true,
      data: state,
      message: "State added successfully",
    });

});
// get all states
export const getAllStates = asyncHandler(async (req, res) => {
  const states = await State.find({}).populate("country", "flag"); 

  const statesWithFlag = states.map((state) => {
    const obj = state.toObject();

    // country object ko hata do
    delete obj.country;

    return {
      ...obj,
      flag: state.country?.flag ? imageToBase64(state.country.flag) : "",
      countryId: state.country?._id,
    };
  });

  res.status(200).json({
    success: true,
    data: statesWithFlag,
  });
});

// get state by id
export const getStateById = asyncHandler(async (req, res) => {
    const state = await State.findById(req.params.id);

    if (!state) {
        return res.status(404).json({ message: "State not found" });
    }

    res.json(state);
});

// update state by id
export const updateState = asyncHandler(async (req, res) => {
    const { id, name, code, countryId } = req.body;

    // Validate State ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid state ID" });
    }

    // Validate Country ID if provided
    if (countryId && !mongoose.Types.ObjectId.isValid(countryId)) {
        return res.status(400).json({ message: "Invalid country ID" });
    }

    // Prepare data to update
    const updateData = {
        name,
        code,
        ...(countryId && { country: countryId })
    };

    // Update the state
    const state = await State.findByIdAndUpdate(id, updateData, { new: true });

    if (!state) {
        return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json(state);
});

// delete state by id
export const deleteState = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid state ID" });
    }

    // Find state by ID
    const state = await State.findById(id);
    if (!state) {
        return res.status(404).json({ message: "State not found" });
    }

    // Check if any city is linked with this state
    const cityExists = await City.findOne({ state: id });
    if (cityExists) {
        return res.status(400).json({
            message: "Cannot delete state with related cities. Delete related cities first."
        });
    }

    // Delete the state
    await State.findByIdAndDelete(id);

    res.json({ message: "State deleted successfully" });
});