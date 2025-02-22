import { Router } from "express";
import adminRoutes from "./AdminRoutes.js";
import countryRoute from "./CountryRoutes.js";
import stateRoute from "./StatesRoutes.js";
import cityRoute from "./CityRoutes.js";
import authRouter from "./Auth.js";

const rootRouter = Router();

rootRouter.use('/auth',authRouter);
rootRouter.use("/admin",adminRoutes);
rootRouter.use('/country',countryRoute);
rootRouter.use('/state',stateRoute);
rootRouter.use('/city',cityRoute);

export default rootRouter;