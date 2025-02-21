import { Router } from "express";
import protect from "../middleware/authMiddleware.js";

import { login, register, updateProfile } from "../controllers/Admin.js";

const adminRouter = Router();

adminRouter.post("/register", register);
adminRouter.post("/login",login);
adminRouter.post("/updateProfile",protect,updateProfile);


export default adminRouter;

