import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { addCountryStatesCities, getAllCountriesStatesCities } from "../controllers/AllLocation.js";
import upload from "../middleware/uploadMiddleware.js";

const allLocationRoute = Router();
allLocationRoute.get('/get',protect,authorize("admin","user"),getAllCountriesStatesCities);
allLocationRoute.post('/add',protect,authorize("admin") , upload.fields([ { name: 'flag', maxCount: 1 } ]), addCountryStatesCities);

export default allLocationRoute;
