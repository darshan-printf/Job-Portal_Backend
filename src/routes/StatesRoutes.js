import { createState, deleteState, getAllStates, getStateById, updateState } from "../controllers/States.js";
import protect from "../middleware/authMiddleware.js";
import { Router } from "express";
import { authorize } from "../middleware/authMiddleware.js";
const stateRoute = Router();

stateRoute.post("/add",protect,authorize("admin"),createState);
stateRoute.get("/get",protect,authorize("admin","user"),getAllStates);  
stateRoute.get('/get/:id',protect,authorize("admin"),getStateById);  
stateRoute.put('/update',protect,authorize("admin"),updateState);  
stateRoute.delete('/delete/:id',protect,authorize("admin"),deleteState);

export default stateRoute;