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

// get chart data for super admin
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

// get chart data for super admin dashboard
export const getChartDataForSuperAdminDeshboard = asyncHandler(async (req, res) => {
    // 1. पिछले 7 दिनों के लिए तारीखें (Last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
    }

    // 2. पिछले 30 दिनों के लिए तारीखें (Last 30 days)
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last30Days.push(date.toISOString().split('T')[0]);
    }

    // 3. पिछले 12 महीनों के लिए (Last 12 months)
    const last12Months = [];
    for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        last12Months.push(date.toISOString().slice(0, 7)); // YYYY-MM format
    }

    // 4. यूज़र क्रिएशन डेटा - पिछले 7 दिन (User Creation - Last 7 days)
    const userStatsLast7Days = await Admin.aggregate([
        { 
            $match: { 
                role: "user", 
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
            } 
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // 5. यूज़र क्रिएशन डेटा - पिछले 30 दिन (User Creation - Last 30 days)
    const userStatsLast30Days = await Admin.aggregate([
        { 
            $match: { 
                role: "user", 
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
            } 
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // 6. यूज़र क्रिएशन डेटा - पिछले 12 महीने (User Creation - Last 12 months)
    const userStatsLast12Months = await Admin.aggregate([
        { 
            $match: { 
                role: "user", 
                createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } 
            } 
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // 7. जॉब क्रिएशन डेटा - पिछले 7 दिन (Job Creation - Last 7 days)
    const jobStatsLast7Days = await Job.aggregate([
        { 
            $match: { 
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
            } 
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // 8. जॉब क्रिएशन डेटा - पिछले 30 दिन (Job Creation - Last 30 days)
    const jobStatsLast30Days = await Job.aggregate([
        { 
            $match: { 
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
            } 
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // 9. जॉब क्रिएशन डेटा - पिछले 12 महीने (Job Creation - Last 12 months)
    const jobStatsLast12Months = await Job.aggregate([
        { 
            $match: { 
                createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } 
            } 
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // 10. शेड्यूल स्टेटस का डेटा (Schedule Status Data)
    const scheduleStatusStats = await Schedule.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    // 11. Final data preparation
    const finalUserStatsLast7Days = last7Days.map(date => {
        const found = userStatsLast7Days.find(stat => stat._id === date);
        return found ? found.count : 0;
    });

    const finalUserStatsLast30Days = last30Days.map(date => {
        const found = userStatsLast30Days.find(stat => stat._id === date);
        return found ? found.count : 0;
    });

    const finalUserStatsLast12Months = last12Months.map(month => {
        const found = userStatsLast12Months.find(stat => stat._id === month);
        return found ? found.count : 0;
    });

    const finalJobStatsLast7Days = last7Days.map(date => {
        const found = jobStatsLast7Days.find(stat => stat._id === date);
        return found ? found.count : 0;
    });

    const finalJobStatsLast30Days = last30Days.map(date => {
        const found = jobStatsLast30Days.find(stat => stat._id === date);
        return found ? found.count : 0;
    });

    const finalJobStatsLast12Months = last12Months.map(month => {
        const found = jobStatsLast12Months.find(stat => stat._id === month);
        return found ? found.count : 0;
    });

    res.json({
        // Daily Data (7 days)
        daily: {
            dates: last7Days,
            newUsers: finalUserStatsLast7Days,
            newJobs: finalJobStatsLast7Days
        },
        // Monthly Data (30 days)
        monthly: {
            dates: last30Days,
            newUsers: finalUserStatsLast30Days,
            newJobs: finalJobStatsLast30Days
        },
        // Yearly Data (12 months)
        yearly: {
            months: last12Months,
            newUsers: finalUserStatsLast12Months,
            newJobs: finalJobStatsLast12Months
        },
        // Other Data
        scheduleStatusData: scheduleStatusStats
    });
});

//get chart data for admin dashboard
export const getChartDataForAdminDashboard = asyncHandler(async (req, res) => {
  const adminId = req.admin._id;
  const admin = await Admin.findById(adminId);

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const companyId = admin.companyId;

  // ✅ Support both from/to and fromDate/toDate
  const from = req.query.from || req.query.fromDate;
  const to = req.query.to || req.query.toDate;

  const startDate = from ? new Date(from) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const endDate = to ? new Date(to) : new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const jobWiseStats = await Candidate.aggregate([
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "jobInfo"
      }
    },
    { $unwind: "$jobInfo" },

    // ✅ Date filter (only jobs inside range)
    {
      $match: {
        "jobInfo.companyId": companyId,
        "jobInfo.createdAt": { $gte: startDate, $lte: endDate }
      }
    },

    // ✅ Group by job
    {
      $group: {
        _id: "$jobId",
        jobTitle: { $first: "$jobInfo.title" },
        jobDate: { $first: "$jobInfo.createdAt" },
        totalCandidates: { $sum: 1 },
        approved: { $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } }
      }
    }
  ]);

  return res.json({
    jobsStats: jobWiseStats
  });
});



