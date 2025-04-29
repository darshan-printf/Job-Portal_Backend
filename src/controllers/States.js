import State from "../models/States.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// carte  new state 
export const createState = asyncHandler(async (req, res) => {
    const { name, code, countryId } = req.body;
    const state = await State.create({ name, code, country:countryId});
   if(!countryId){
       return res.status(404).json({ message: "Country not found" });
   } 
   res.status(201).json(state);
   
});

// get all states
export const getAllStates = asyncHandler(async (req, res) => {
    const states = await State.find({});
    res.json(states);
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
import mongoose from "mongoose";

export const updateState = asyncHandler(async (req, res) => {
    const { id, name, code } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid state ID " });
    }

    const state = await State.findByIdAndUpdate(id, { name, code }, { new: true });

    if (!state) {
        return res.status(404).json({ message: "State not found" });
    }

    res.json(state);
});


// delete state by id
export const deleteState = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid state ID " });
    }

    // Find state by ID
    const state = await State.findById(id);
    if (!state) {
        return res.status(404).json({ message: "State not found" });
    }

    // Delete the state
    await State.findByIdAndDelete(id);

    res.json({ message: "State deleted successfully" });
});