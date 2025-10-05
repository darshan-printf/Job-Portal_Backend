import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { addSchedule, getScheduleById } from "../controllers/Sedual.js";

const scheduleRoute = Router();

scheduleRoute.post("/add", protect, authorize("user"), addSchedule);
scheduleRoute.get("/get", protect, authorize("user"), getScheduleById);
scheduleRoute.get("/get/:id", protect, authorize("user"), getScheduleById);


export default scheduleRoute;