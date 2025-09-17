import { Router } from "express";
import adminRoutes from "./AdminRoutes.js";
import countryRoute from "./CountryRoutes.js";
import stateRoute from "./StatesRoutes.js";
import cityRoute from "./CityRoutes.js";
import authRouter from "./Auth.js";
import userRoute from "./User.js";
import educationRoute from "./Education.js";
import jobRoute from "./JobRoutes.js";
import Reports from "./Reports.js";
import companyRoute from "./CompanyRoute.js";
import Inbox from "./Inbox.js";
import feedback from "./Feedback.js";

const rootRouter = Router();

rootRouter.use('/auth',authRouter);
rootRouter.use("/admin",adminRoutes);
rootRouter.use('/country',countryRoute);
rootRouter.use('/state',stateRoute);
rootRouter.use('/city',cityRoute);
rootRouter.use('/user',userRoute);
rootRouter.use('/Education',educationRoute);
rootRouter.use('/job',jobRoute);
rootRouter.use('/reports',Reports);
rootRouter.use('/company',companyRoute);
rootRouter.use('/inbox',Inbox);
rootRouter.use('/feedback',feedback);




export default rootRouter;