import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { addFeedback, getAllFeedback } from "../controllers/Feedback.js";


const feedback = Router();

feedback.get("/get",protect,authorize("admin"),getAllFeedback);
feedback.get("/getFeedback",getAllFeedback);
feedback.post("/add",addFeedback);   


export default feedback;