import express from "express";
import { getChatHistory, markAsRead } from "../controllers/chatController.js";

const router = express.Router();

// /api/chat/:user1/:user2  -> chat history
router.get("/:user1/:user2", getChatHistory);

// /api/chat/read/:me/:other -> unread -> read
router.post("/read/:me/:other", markAsRead);

export default router;
