import { Router } from "express";
import { login, register, listUsers, editUser, deleteUser, getUserById } from "../controllers/user.js"; // ✅ Correct function name
import protect from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.route("/register").post(register); // ✅ Correct function name
userRouter.route("/login").post(login);
userRouter.route("/list").get(protect ,listUsers);
userRouter.route("/get/:id").get(protect, getUserById);
userRouter.route("/edit/:id").put(protect, editUser);
userRouter.route("/delete/:id").delete(protect, deleteUser);    


export default userRouter;
