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
