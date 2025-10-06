import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { addSchedule, getSchedule } from "../controllers/Sedual.js";

const scheduleRoute = Router();

scheduleRoute.put("/status", protect, authorize("user"), addSchedule);
scheduleRoute.get("/getschedule", protect, authorize("user"), getSchedule);

export default scheduleRoute;