import { Router } from "express";
import { login, register, useRegister } from "../controllers/Auth.js";
import upload from "../middleware/uploadMiddleware.js";

const authRouter = Router();


authRouter.post("/register",register);
authRouter.post(
    "/useRegister",
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'profileImage', maxCount: 1 }
    ]),
    useRegister
);
authRouter.post("/login",login);

export default authRouter;