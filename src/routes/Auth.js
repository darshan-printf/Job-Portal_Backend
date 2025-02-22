import { Router } from "express";
import { login, register, useRegister } from "../controllers/Auth.js";

const authRouter = Router();


authRouter.post("/register",register);
authRouter.post("/useRegister",useRegister);
authRouter.post("/login",login);

export default authRouter;