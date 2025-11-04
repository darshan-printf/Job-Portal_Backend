import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { getChartDataForAdminDashboard, getChartDataForSuperAdmin, getChartDataForSuperAdminDeshboard, getCompanyJobLocationsAndCandidates, getFullReportForSuperAdmin, getTotalCounts, getTotalCountsForAdminDashboard } from "../controllers/Reports.js";
const Reports = Router();

Reports.get("/getCount",protect,authorize("admin"),getTotalCounts);
Reports.get("/getCountAdmin",protect,authorize("user"),getTotalCountsForAdminDashboard);
Reports.get("/getStats", getCompanyJobLocationsAndCandidates);
Reports.get("/getFullReport", protect, authorize("admin"), getFullReportForSuperAdmin);
Reports.get("/getChartData", protect, authorize("admin"), getChartDataForSuperAdmin);
Reports.get("/getChartDataForSuperAdminDashboard", protect, authorize("admin"), getChartDataForSuperAdminDeshboard);
Reports.get("/getChartDataForAdminDashboard", protect, authorize("user"), getChartDataForAdminDashboard);



export default Reports;