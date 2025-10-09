import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { addCountryStatesCities, getAllCountriesStatesCities } from "../controllers/AllLocation.js";

const allLocationRoute = Router();
allLocationRoute.get('/get',protect,authorize("admin","user"),getAllCountriesStatesCities);
allLocationRoute.post('/add',protect,authorize("admin") , addCountryStatesCities);

export default allLocationRoute;

