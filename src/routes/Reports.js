import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { getCompanyJobLocationsAndCandidates, getTotalCounts, getTotalCountsForAdminDashboard } from "../controllers/Reports.js";
const Reports = Router();

Reports.get("/getCount",protect,authorize("admin"),getTotalCounts);
Reports.get("/getCountAdmin",protect,authorize("user"),getTotalCountsForAdminDashboard);
Reports.get("/getStats", getCompanyJobLocationsAndCandidates);


export default Reports;