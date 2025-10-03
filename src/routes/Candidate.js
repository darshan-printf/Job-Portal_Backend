import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import { applyJob, changeCandidateStatus, getCandidateByCompanyId, getCandidateById, getScheduledCandidates, } from "../controllers/Candidate.js";

const candidateRoute = Router();

candidateRoute.post("/apply",upload.single("resume"),applyJob);
candidateRoute.get("/get",protect, authorize('user'),  getCandidateByCompanyId);
candidateRoute.get("/get/:id",protect, authorize('user'),  getCandidateById);
candidateRoute.put("/changeStatus",protect, authorize('user'),  changeCandidateStatus);
candidateRoute.get("/scheduled",protect, authorize('user'),  getScheduledCandidates);



export default candidateRoute;
