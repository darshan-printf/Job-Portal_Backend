import { asyncHandler } from "../utils/asyncHandler.js";

import Admin from "../models/Admin.js";
import Candidate from "../models/Candidate.js";
import City from "../models/City.js";
import Company from "../models/Company.js";
import Country from "../models/Country.js";
import Feedback from "../models/Feedback.js";
import Inbox from "../models/Inbox.js";
import Job from "../models/Job.js";
import Package from "../models/Package.js";
import Schedule from "../models/Schedule.js";
import State from "../models/States.js";
import Team from "../models/Team.js";

// get total counts for SuperAdminDashboard
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
    totalCompanies,
  });
});

//  get total count for AdminDashboard
export const getTotalCountsForAdminDashboard = asyncHandler(
  async (req, res) => {
    const adminId = req.admin._id;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const companyId = admin.companyId;
    const totalJobs = await Job.countDocuments({ companyId });
    const totalCandidates = await Candidate.countDocuments({ companyId });
    const totalPendingCandidates = await Schedule.countDocuments({
      companyId,
      status: "scheduled",
    });
    const totalCompletedCandidates = await Schedule.countDocuments({
      companyId,
      status: { $in: ["accepted", "offered"] },
    });
    res.json({
      totalJobs,
      totalCandidates,
      totalPendingCandidates,
      totalCompletedCandidates,
    });
  }
);

// get total company job locations and candidate
export const getCompanyJobLocationsAndCandidates = asyncHandler(
  async (req, res) => {
    const totalCountries = await Country.countDocuments();
    const totalStates = await State.countDocuments();
    const totalCities = await City.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalCandidates = await Candidate.countDocuments();
    res.json({
      locatons: totalCountries + totalStates + totalCities,
      totalCompanies,
      totalJobs,
      totalCandidates,
    });
  }
);

// get full repost for super admin
export const getFullReportForSuperAdmin = asyncHandler(async (req, res) => {
  const totalUsers = await Admin.countDocuments({ role: "user" });
  const totalCandidates = await Candidate.countDocuments();
  const totalCities = await City.countDocuments();
  const totalCompanies = await Company.countDocuments();
  const totalCountries = await Country.countDocuments();
  const totalFeedbacks = await Feedback.countDocuments();
  const totalJobs = await Job.countDocuments();
  const totalPackages = await Package.countDocuments();
  const totalStates = await State.countDocuments();
  const totalTeams = await Team.countDocuments();
  const totalInbox = await Inbox.countDocuments();
  const totalSchedules = await Schedule.countDocuments();
  const scheduled = await Schedule.countDocuments({ status: "scheduled" });
  const completed = await Schedule.countDocuments({ status: "completed" });
  const cancelled = await Schedule.countDocuments({ status: "cancelled" });
  const rejected = await Schedule.countDocuments({ status: "rejected" });
  const accepted = await Schedule.countDocuments({ status: "accepted" });
  const offered = await Schedule.countDocuments({ status: "offered" });
  const pending = await Schedule.countDocuments({ status: "pending" });

  res.json({
    totalUsers,
    totalCandidates,
    totalCities,
    totalCompanies,
    totalCountries,
    totalFeedbacks,
    totalJobs,
    totalPackages,
    totalSchedules,
    totalStates,
    totalTeams,
    totalInbox,
    scheduled,
    completed,
    cancelled,
    rejected,
    accepted,
    offered,
    pending,
  });
});

export const getChartDataForSuperAdmin = asyncHandler(async (req, res) => {
    // 1. पिछले 7 दिनों के लिए तारीखें (Dates for last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        // तारीख को 'YYYY-MM-DD' फॉर्मेट में स्टोर करना
        last7Days.push(date.toISOString().split('T')[0]);
    }

    // 2. यूज़र क्रिएशन डेटा (User Creation Data)
    const userStats = await Admin.aggregate([
        { $match: { role: "user", createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);
    
    // 3. जॉब क्रिएशन डेटा (Job Creation Data - पिछले 7 दिन)
    const jobStats = await Job.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // 4. शेड्यूल स्टेटस का डेटा (Schedule Status Data - Pie Chart के लिए)
    const scheduleStatusStats = await Schedule.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    // 5. response को ग्राफ़ के लिए उपयुक्त बनाना
    const finalUserStats = last7Days.map(date => {
        const found = userStats.find(stat => stat._id === date);
        return found ? found.count : 0;
    });

    const finalJobStats = last7Days.map(date => {
        const found = jobStats.find(stat => stat._id === date);
        return found ? found.count : 0;
    });

    res.json({
        dates: last7Days,
        newUsersLast7Days: finalUserStats,
        newJobsLast7Days: finalJobStats,
        scheduleStatusData: scheduleStatusStats
    });
});