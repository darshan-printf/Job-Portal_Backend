import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { addEducation, deleteEducation, getAllEducation, getEducationById, updateEducation } from "../controllers/Education.js";

const educationRoute = Router();

educationRoute.post("/add", protect, authorize("admin"), addEducation);
educationRoute.get("/get", protect, authorize("admin","user"), getAllEducation);
educationRoute.get('/get/:id', protect, authorize("admin"), getEducationById);
educationRoute.put('/update', protect, authorize("admin"), updateEducation);
educationRoute.delete('/delete/:id', protect, authorize("admin"), deleteEducation);


export default educationRoute;