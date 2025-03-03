import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { createCity, deleteCity, getAllCitys, getCityById, updateCity } from "../controllers/City.js";

const cityRoute = Router();

cityRoute.post("/add",protect,authorize("admin"),createCity);
cityRoute.get("/get",protect,authorize("admin","user"),getAllCitys);
cityRoute.get('/get/:id',protect,authorize("admin"),getCityById);
cityRoute.put('/update',protect,authorize("admin"),updateCity);
cityRoute.delete('/delete/:id',protect,authorize("admin"),deleteCity);

export default cityRoute;