import protect from "../middleware/authMiddleware.js";
import { Router } from "express";
import { authorize } from "../middleware/authMiddleware.js";
import { addTeam, deleteTeam, getAllTeam, getTeamById, updateTeam } from "../controllers/Team.js";
import upload from "../middleware/uploadMiddleware.js";


const teamRoute = Router();

teamRoute.post("/add",protect,authorize("admin"), upload.fields([  { name: 'image', maxCount: 1 }]), addTeam);
teamRoute.get("/get",protect,authorize("admin"),getAllTeam);
teamRoute.get('/get/:id',protect,authorize("admin"),getTeamById);
teamRoute.put('/update',protect,authorize("admin"), upload.fields([  { name: 'image', maxCount: 1 }]), updateTeam);

teamRoute.delete('/delete/:id',protect,authorize("admin"),deleteTeam);


export default teamRoute;