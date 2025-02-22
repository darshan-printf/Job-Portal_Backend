import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { createCity, deleteCity, getAllCities, getCityById, updateCity } from "../controllers/City.js";

const cityRoute = Router();

cityRoute.post("/add",protect,createCity);
cityRoute.get("/get",protect,getAllCities);
cityRoute.get('/get/:id',protect,getCityById);
cityRoute.put('/update',protect,updateCity);
cityRoute.delete('/delete/:id',protect,deleteCity);

export default cityRoute;