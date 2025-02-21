import { Router } from "express";
import adminRoutes from "./AdminRoutes.js";

const rootRouter = Router();

rootRouter.use("/admin",adminRoutes );

export default rootRouter;