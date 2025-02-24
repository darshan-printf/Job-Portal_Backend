import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/Admin.js";

const adminRouter = Router();

adminRouter.post("/updateProfile",protect,authorize("admin"), updateProfile);


export default adminRouter;

