import protect from "../middleware/authMiddleware.js";
import { Router } from "express";
import { authorize } from "../middleware/authMiddleware.js";
import { activeStatus, deleteUser, getAllUsers, getUserById, updateUser, useAdd } from "../controllers/User.js";
import upload from "../middleware/uploadMiddleware.js";

const userRoute = Router();

userRoute.post("/add", protect,  authorize("admin"),  upload.fields([  { name: 'profileImage', maxCount: 1 }]), useAdd);
userRoute.put(  '/update',protect, authorize("admin"), upload.fields([ { name: 'profileImage', maxCount: 1 }]), updateUser); 
userRoute.delete('/delete/:id', protect, authorize("admin"), deleteUser);
userRoute.put('/active/:id', protect, authorize("admin"), activeStatus);
userRoute.get("/get", protect, authorize("admin"), getAllUsers);
userRoute.get('/get/:id', protect, authorize("admin"), getUserById);


export default userRoute;