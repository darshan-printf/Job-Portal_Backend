import mongoose from "mongoose";
import City from "../models/City.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import imageToBase64 from "../utils/imageToBase64.js";


// carte  new state
export const createCity = asyncHandler(async (req, res) => {
    const { name, code, stateId } = req.body;
    const city = new City({ name, code, state: stateId });
    await city.save();
    res.status(201).json(city);
});

// get all states
export const getAllCitys = asyncHandler(async (req, res) => {
  const citys = await City.find({})
    .populate({
      path: "state",
      populate: {
        path: "country",
        select: "flag", // sirf flag lana
      },
      select: "country", // state ka sirf country chahiye
    });

  const citysWithFlag = citys.map((city) => {
    const obj = city.toObject();

    return {
      _id: obj._id,
      name: obj.name,
      code: obj.code,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      flag:imageToBase64(city.state.country.flag),
      stateId: obj.state?._id,

     };
  });

  res.status(200).json({
    success: true,
    data: citysWithFlag,
  });
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

