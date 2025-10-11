import { Router } from "express";
import { addJobAdmin, addJobUser, deleteJob, getAllJobbyJobBord, getAllJobs, getAllJobsByUser, getJobById, updateJob } from "../controllers/Job.js";
import protect, { authorize } from "../middleware/authMiddleware.js";



const jobRoute = Router();

jobRoute.post("/addAdmin",protect, authorize("admin"), addJobAdmin);
jobRoute.get("/get",protect, authorize("admin"), getAllJobs);
jobRoute.get("/get/:id",protect, authorize("admin", "user"), getJobById);
jobRoute.delete("/delete/:id",protect, authorize("admin", "user"), deleteJob);
jobRoute.put("/update",protect, authorize("admin","user"), updateJob);
jobRoute.post("/addPost",protect, authorize("user"), addJobUser);
jobRoute.get("/getPosts",protect, authorize("user"), getAllJobsByUser);
jobRoute.get("/getJobPosts", getAllJobbyJobBord);

export default jobRoute;