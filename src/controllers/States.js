import State from "../models/States.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// carte  new state 
export const createState = asyncHandler(async (req, res) => {
    const { name, code, countryId } = req.body;
    const state = await State.create({ name, code, country:countryId});
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
export const updateState = asyncHandler(async (req, res) => {   
    const state = await State.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!state) {
        return res.status(404).json({ message: "State not found" });
    }
    res.json(state);
});

// delete state by id
export const deleteState = asyncHandler(async (req, res) => {
    const state = await State.findById(req.params.id);
    if (!state) {
        return res.status(404).json({ message: "State not found" });
    }
    await state.remove();
    res.json({ message: "State deleted successfully" });
});