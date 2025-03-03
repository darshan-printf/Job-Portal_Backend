import { Router } from "express";
import { addJob, getAllJobs, getJobsByUserId } from "../controllers/Job.js";
import protect from "../middleware/authMiddleware.js";
import { get } from "mongoose";


const jobRoute = Router();

jobRoute.post("/add",protect,addJob);
jobRoute.get("/allget",protect,getAllJobs);
jobRoute.get("/get",protect,getJobsByUserId);

export default jobRoute;