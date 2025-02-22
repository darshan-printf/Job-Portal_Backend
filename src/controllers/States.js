import State from "../models/States.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const createState = asyncHandler(async (req, res) => {
    const { name, code, countryId } = req.body;
    const state = await State.create({ name, code, country:countryId});
    res.status(201).json(state);
});