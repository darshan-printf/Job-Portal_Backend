import { asyncHandler } from "../utils/asyncHandler.js";
import City from "../models/City.js";
import imageToBase64 from "../utils/imageToBase64.js";
import State from "../models/States.js";

export const getAllCountriesStatesCities = asyncHandler(async (req, res) => {
  const cities = await City.find({}, "name")
    .populate({
      path: "state",
      select: "name country",
      populate: {
        path: "country",
        select: "name flag "
      }
    });

  const formatted = cities.map(city => ({
    flag: imageToBase64(city.state?.country?.flag) || "",
    country: city.state?.country?.name || "",
    state: city.state?.name || "",
    city: city.name,
  }));

  res.json(formatted);
});

// 👇 Helper function to generate code like GJ14244 or RJ745856
const generateCode = (name) => {
  const short = name.trim().substring(0, 2).toUpperCase(); // First 2 letters
  const randomNum = Math.floor(10000 + Math.random() * 90000); // Random 5 digit number
  return `${short}${randomNum}`;
};

// Add One Country and Country States and Cities multiple add
export const addCountryStatesCities = asyncHandler(async (req, res) => {
  const { countryId, states } = req.body;

  if (!countryId) {
    return res.status(400).json({ message: "Country ID is required" });
  }

  for (const state of states) {
    // ✅ Generate code for state
    const stateCode = generateCode(state.name);

    // Create State
    const newState = await State.create({
      name: state.name,
      code: stateCode,
      country: countryId,
    });

    for (const city of state.cities) {
      // ✅ Generate code for city
      const cityCode = generateCode(city);

      await City.create({
        name: city,
        code: cityCode,
        state: newState._id,
        country: countryId,
      });
    }
  }

  res.status(201).json({ message: "States and cities added successfully" });
});

