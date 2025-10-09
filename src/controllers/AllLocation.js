import { asyncHandler } from "../utils/asyncHandler.js";
import City from "../models/City.js";
import imageToBase64 from "../utils/imageToBase64.js";

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

// Add One Country and Country States and Cities multiple add
export const addCountryStatesCities = asyncHandler(async (req, res) => {
  const { country, states } = req.body;

  // Create the country
  const newCountry = await Country.create({
    name: country.name,
    code: country.code,
    flag: country.flag,
  });

  // Create states and cities
  for (const state of states) {
    const newState = await State.create({
      name: state.name,
      code: state.code,
      country: newCountry._id,
    });

    for (const city of state.cities) {
      await City.create({
        name: city,
        code: city.replace(/\s+/g, "").toUpperCase(),
        state: newState._id,
      });
    }
  }

  res.status(201).json({ message: "Country, states, and cities added successfully" });
});
