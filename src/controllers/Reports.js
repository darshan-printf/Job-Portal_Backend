import { asyncHandler } from "../utils/asyncHandler.js";
import Country from "../models/Country.js";
import State from "../models/States.js";
import City from "../models/City.js";
import Admin from "../models/Admin.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";

// get total counts
export const getTotalCounts = asyncHandler(async (req, res) => {
    const totalCountries = await Country.countDocuments();
    const totalStates = await State.countDocuments();
    const totalCities = await City.countDocuments();
    const totalUsers = await Admin.countDocuments({ role: "user" });
    const totalJobs = await Job.countDocuments();
    const totalCompanies = await Company.countDocuments();

    res.json({
        totalCountries,
        totalStates,
        totalCities,
        totalUsers,
        totalJobs,
        totalCompanies

    });
});
