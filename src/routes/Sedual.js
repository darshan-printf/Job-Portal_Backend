import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { getSchedule, updateSchedule } from "../controllers/Sedual.js";

const scheduleRoute = Router();


scheduleRoute.get("/getschedule", protect, authorize("user"), getSchedule);
scheduleRoute.put("/update/:id", protect, authorize("user"), updateSchedule);

export default scheduleRoute;