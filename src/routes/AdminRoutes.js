import { Router } from "express";
import protect from "../middleware/authMiddleware.js";

import { login, register } from "../controllers/Admin.js";

const adminRouter = Router();

adminRouter.post("/register", register);
adminRouter.post("/login",login);


export default adminRouter;

