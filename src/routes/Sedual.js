import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { addSchedule, getScheduleById } from "../controllers/Sedual.js";

const scheduleRoute = Router();

// add schedule
scheduleRoute.post("/add", protect, authorize("user"), addSchedule);
// get schedule candidate all
scheduleRoute.get("/get", protect, authorize("user"), getScheduleById);


export default scheduleRoute;