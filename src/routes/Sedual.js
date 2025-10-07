import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { getSchedule, getScheduleById, sendOfferLetter, updateSchedule } from "../controllers/Sedual.js";

const scheduleRoute = Router();


scheduleRoute.get("/getschedule", protect, authorize("user"), getSchedule);
scheduleRoute.put("/update/:id", protect, authorize("user"), updateSchedule);
scheduleRoute.get("/getschedule/:id", protect, authorize("user"), getScheduleById);
scheduleRoute.put("/sendofferletter/:id", protect, authorize("user"), sendOfferLetter);



export default scheduleRoute;