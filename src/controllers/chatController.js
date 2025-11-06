import Message from "../models/Message.js";
import Admin from "../models/Admin.js";
import { StatusCodes } from "http-status-codes";

// Optionally: role guard (admin ↔ user only)
const ensureSuperAdminAndAdmin = async (u1, u2) => {
  const [a, b] = await Promise.all([Admin.findById(u1), Admin.findById(u2)]);
  if (!a || !b) return false;
  // Rule: superadmin(role: "admin") <-> admin(role: "user")
  const okPair =
    (a.role === "admin" && b.role === "user") ||
    (a.role === "user" && b.role === "admin");
  return okPair;
};

export const getChatHistory = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    // Optional strict rule (enable if you want):
    if (!(await ensureSuperAdminAndAdmin(user1, user2))) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not allowed" });
    }

    const items = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort({ createdAt: 1 });

    res.status(StatusCodes.OK).json(items);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};

export const markAsRead = async (req, res) => {
  console.log(req, "hello");
  try {
    const { me, other } = req.params;
    await Message.updateMany(
      { receiverId: me, senderId: other, readAt: null },
      { $set: { readAt: new Date() } }
    );
    res.status(StatusCodes.OK).json({ ok: true });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
  }
};
