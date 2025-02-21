import { Router } from "express";
import adminRoutes from "./AdminRoutes.js";
import countryRoute from "./CountryRoutes.js";
const rootRouter = Router();

rootRouter.use("/admin",adminRoutes);
rootRouter.use('/country',countryRoute);

export default rootRouter;