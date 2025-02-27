import protect from "../middleware/authMiddleware.js";
import { Router } from "express";
import { authorize } from "../middleware/authMiddleware.js";
import { activeStatus, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/User.js";

const userRoute = Router();

userRoute.get("/get",protect,authorize("admin"),getAllUsers);
userRoute.get('/get/:id',protect,authorize("admin"),getUserById);
userRoute.put('/update',protect,authorize("admin"),updateUser);
userRoute.delete('/delete/:id',protect,authorize("admin"),deleteUser);
userRoute.put('/active/:id',protect,authorize("admin"),activeStatus);


export default userRoute;