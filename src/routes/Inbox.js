import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authMiddleware.js";
import { addInbox, getAllInbox } from "../controllers/Inbox.js";

const inbox = Router();
 
inbox.post("/add",addInbox);
inbox.get("/get",protect,authorize("admin"),getAllInbox);
export default inbox;