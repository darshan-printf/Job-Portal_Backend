import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { getAllCountriesStatesCities } from "../controllers/AllLocation.js";
const allLocationRoute = Router();
allLocationRoute.get('/get',protect,authorize("admin","user"),getAllCountriesStatesCities);

export default allLocationRoute;
