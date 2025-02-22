import { createState } from "../controllers/States.js";
import protect from "../middleware/authMiddleware.js";
import { Router } from "express";


const stateRoute = Router();


stateRoute.post("/add",protect,createState);

export default stateRoute;