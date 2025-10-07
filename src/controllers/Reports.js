import { asyncHandler } from "../utils/asyncHandler.js";
import Country from "../models/Country.js";
import State from "../models/States.js";
import City from "../models/City.js";
import Admin from "../models/Admin.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Candidate from "../models/Candidate.js";
import Schedule from "../models/Schedule.js";

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

//  get total count for AdminDashboard
export const getTotalCountsForAdminDashboard = asyncHandler(async (req, res) => {
    const adminId = req.admin._id;
    const admin = await Admin.findById(adminId);
    if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
    }
    const companyId = admin.companyId;
    const totalJobs = await Job.countDocuments({ companyId });
    const totalCandidates = await Candidate.countDocuments({ companyId });
    const totalPendingCandidates = await Schedule.countDocuments({ companyId, status: "scheduled" });
    const totalCompletedCandidates = await Schedule.countDocuments({ companyId, status: { $in: ["accepted", "offered"] } });



    
    res.json({
        totalJobs,
        totalCandidates,
        totalPendingCandidates,
        totalCompletedCandidates,
    });
});


