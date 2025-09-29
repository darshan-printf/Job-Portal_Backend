import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import { applyJob, getCandidateByCompanyId, } from "../controllers/Candidate.js";

const candidateRoute = Router();

candidateRoute.post("/apply",upload.single("resume"),applyJob);
candidateRoute.get("/get",protect, authorize('user'),  getCandidateByCompanyId);




export default candidateRoute;
