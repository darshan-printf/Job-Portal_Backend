import { Router } from "express";
import protect from "../middleware/authMiddleware.js";

import { updateProfile } from "../controllers/Admin.js";

const adminRouter = Router();

adminRouter.post("/updateProfile",protect,updateProfile);


export default adminRouter;

