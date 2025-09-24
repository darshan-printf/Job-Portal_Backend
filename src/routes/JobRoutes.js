import { Router } from "express";
import { addJobAdmin, addJobUser, deleteJob, getAllJobs, getAllJobsByUser, getJobById, updateJob } from "../controllers/Job.js";
import protect, { authorize } from "../middleware/authMiddleware.js";



const jobRoute = Router();

jobRoute.post("/addAdmin",protect, authorize("admin"), addJobAdmin);
jobRoute.get("/get",protect, authorize("admin"), getAllJobs);
jobRoute.get("/get/:id",protect, authorize("admin"), getJobById);
jobRoute.delete("/delete/:id",protect, authorize("admin"), deleteJob);
jobRoute.put("/update",protect, authorize("admin"), updateJob);

// add job user
jobRoute.post("/addPost",protect, authorize("user"), addJobUser);
jobRoute.get("/getPosts",protect, authorize("user"), getAllJobsByUser);




export default jobRoute;