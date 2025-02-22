import { createState, deleteState, getAllStates, getStateById, updateState } from "../controllers/States.js";
import protect from "../middleware/authMiddleware.js";
import { Router } from "express";
const stateRoute = Router();

stateRoute.post("/add",protect,createState);
stateRoute.get("/get",protect,getAllStates);  
stateRoute.get('/get/:id',protect,getStateById);  
stateRoute.put('/update',protect,updateState);  
stateRoute.delete('/delete/:id',protect,deleteState);

export default stateRoute;