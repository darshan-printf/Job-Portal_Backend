import { Router } from "express";
import adminRoutes from "./AdminRoutes.js";
import countryRoute from "./CountryRoutes.js";
import stateRoute from "./StatesRoutes.js";
import cityRoute from "./CityRoutes.js";
import authRouter from "./Auth.js";
import userRoute from "./User.js";
import educationRoute from "./Education.js";
import jobRoute from "./JobRoutes.js";

const rootRouter = Router();

rootRouter.use('/auth',authRouter);
rootRouter.use("/admin",adminRoutes);
rootRouter.use('/country',countryRoute);
rootRouter.use('/state',stateRoute);
rootRouter.use('/city',cityRoute);
rootRouter.use('/user',userRoute);
rootRouter.use('/Education',educationRoute);
rootRouter.use('/job',jobRoute);

export default rootRouter;