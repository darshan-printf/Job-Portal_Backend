import { Router } from "express";
import adminRoutes from "./AdminRoutes.js";
import countryRoute from "./CountryRoutes.js";
import stateRoute from "./StatesRoutes.js";
const rootRouter = Router();

rootRouter.use("/admin",adminRoutes);
rootRouter.use('/country',countryRoute);
rootRouter.use('/state',stateRoute);

export default rootRouter;