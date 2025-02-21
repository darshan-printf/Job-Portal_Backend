import { Router } from "express";
import { createCountry, getAllCountries, getCountryById, updateCountry } from "../controllers/Country.js";
import protect from "../middleware/authMiddleware.js";

const countryRoute = Router();


countryRoute.post("/add",protect,createCountry);
countryRoute.get("/get",protect,getAllCountries);
countryRoute.get('/get/:id',protect,getCountryById);
countryRoute.put('/update',protect,updateCountry);

export default countryRoute;