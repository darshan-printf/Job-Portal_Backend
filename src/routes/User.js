import protect from "../middleware/authMiddleware.js";
import { Router } from "express";

import { deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/User.js";

const userRoute = Router();

userRoute.get("/get",protect,getAllUsers);
userRoute.get('/get/:id',protect,getUserById);
userRoute.put('/update',protect,updateUser);
userRoute.delete('/delete/:id',protect,deleteUser);

export default userRoute;