import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { addSchedule } from "../controllers/Sedual.js";

const scheduleRoute = Router();

// add schedule
scheduleRoute.post("/add", protect, authorize("user"), addSchedule);

export default scheduleRoute;