import { Router } from "express";
import { createCountry, deleteCountry, getAllCountries, getCountryById, updateCountry } from "../controllers/Country.js";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const countryRoute = Router();


countryRoute.post("/add",protect,authorize("admin"), upload.fields([ { name: 'flag', maxCount: 1 } ]),createCountry);
countryRoute.get("/get",protect,authorize("admin","user"),getAllCountries);
countryRoute.get('/get/:id',protect,authorize("admin"),getCountryById);
countryRoute.put('/update',protect,authorize("admin"), upload.fields([ { name: 'flag', maxCount: 1 } ]),updateCountry);
countryRoute.delete('/delete/:id',protect,authorize("admin"),deleteCountry);

export default countryRoute;