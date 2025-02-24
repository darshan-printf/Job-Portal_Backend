import protect from "../middleware/authMiddleware.js";
import { Router } from "express";

import { activeStatus, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/User.js";

const userRoute = Router();

userRoute.get("/get",protect,getAllUsers);
userRoute.get('/get/:id',protect,getUserById);
userRoute.put('/update',protect,updateUser);
userRoute.delete('/delete/:id',protect,deleteUser);
userRoute.put('/active/:id',protect,activeStatus);


export default userRoute;