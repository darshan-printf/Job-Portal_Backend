import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { changePassword, getAdminById, getAdminDetails, updateProfile } from "../controllers/Admin.js";
import upload from "../middleware/uploadMiddleware.js";

const adminRouter = Router();

adminRouter.post("/updateProfile",protect,authorize("admin","user" ), upload.fields([  { name: 'profileImage', maxCount: 1 }]), updateProfile);
adminRouter.get("/get/:id",protect,authorize("admin","user"),getAdminById);
adminRouter.put("/changepassword" ,protect ,authorize("admin","user"),changePassword)
adminRouter.get("/chatditails",protect,authorize("admin","user"),getAdminDetails);

export default adminRouter;