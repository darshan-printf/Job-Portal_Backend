import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { getAdminById, updateProfile } from "../controllers/Admin.js";
import upload from "../middleware/uploadMiddleware.js";

const adminRouter = Router();

adminRouter.post("/updateProfile",protect,authorize("admin"), upload.fields([  { name: 'profileImage', maxCount: 1 }]), updateProfile);
adminRouter.get("/get/:id",protect,authorize("admin"),getAdminById);


export default adminRouter;

