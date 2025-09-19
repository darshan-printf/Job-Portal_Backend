import { Router } from "express";
import { login, register,  } from "../controllers/Auth.js";
import upload from "../middleware/uploadMiddleware.js";
const authRouter = Router();


authRouter.post("/register",upload.fields([  { name: 'profileImage', maxCount: 1 }]),register );
authRouter.post("/login",login);

export default authRouter;