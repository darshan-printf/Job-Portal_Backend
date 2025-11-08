// backend/socket.js
import { Server } from "socket.io";
import Message from "./models/Message.js";
import Admin from "./models/Admin.js";
import imageToBase64 from "../src/utils/imageToBase64.js";

const onlineUsers = new Map(); // userId -> Set(socketIds)

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // ✅ Broadcast Users (Admin Dashboard)
  const broadcastUsers = async () => {
    const users = await Admin.find({ role: "user" }).lean();
    const admin = await Admin.findOne({ role: "admin" }).lean();

    const finalUsers = await Promise.all(
      users.map(async (u) => {
        const unseenCount = await Message.countDocuments({
          senderId: u._id,
          receiverId: admin._id,
          seen: false,
        });

        let base64Image = "";
        if (u.profileImage) {
          try {
            base64Image = await imageToBase64(u.profileImage);
          } catch {
            base64Image = "";
          }
        }

        return {
          ...u,
          profileImage: base64Image,
          online: onlineUsers.has(String(u._id)),
          unseen: unseenCount,
        };
      })
    );

    io.emit("usersList", finalUsers);
  };

  // ✅ Main Socket Connection
  io.on("connection", (socket) => {

    // ✅ JOIN
    socket.on("join", async ({ userId }) => {
      const id = String(userId);

      // Track socket
      if (!onlineUsers.has(id)) onlineUsers.set(id, new Set());
      onlineUsers.get(id).add(socket.id);

      // Mark in DB
      await Admin.findByIdAndUpdate(id, { online: true });

      // Join personal room
      socket.join(id);

      // ✅ Notify others that THIS user is online
      socket.broadcast.emit("userOnline", id);

      // ✅ Send to THIS user who else is already online
      for (const uid of onlineUsers.keys()) {
        if (uid !== id) socket.emit("userOnline", uid);
      }

      broadcastUsers();
    });

    // ✅ TYPING
    socket.on("typing", (senderId) => {
      socket.broadcast.emit("typing", senderId);
    });

    socket.on("stopTyping", (senderId) => {
      socket.broadcast.emit("stopTyping", senderId);
    });

    // ✅ SEND MESSAGE
    socket.on("sendMessage", async (payload, ack) => {
      try {
        const { senderId, receiverId, message } = payload;

        const doc = await Message.create({
          senderId,
          receiverId,
          message,
        });

        const msgObj = {
          _id: doc._id,
          senderId,
          receiverId,
          message,
          createdAt: doc.createdAt,
        };

        io.to(String(senderId)).emit("receiveMessage", msgObj);
        io.to(String(receiverId)).emit("receiveMessage", msgObj);

        broadcastUsers();
        if (ack) ack({ ok: true });

      } catch (err) {
        console.log("Socket error:", err);
        if (ack) ack({ ok: false });
      }
    });

    // ✅ MARK SEEN
    socket.on("markSeen", async ({ userId, fromId }) => {
      await Message.updateMany(
        { senderId: fromId, receiverId: userId, seen: false },
        { seen: true, readAt: new Date() }
      );
      broadcastUsers();
    });

    // ✅ DISCONNECT
    socket.on("disconnect", async () => {
      let offlineUser = null;

      for (const [uid, sockets] of onlineUsers) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            offlineUser = uid;
            onlineUsers.delete(uid);
          }
        }
      }

      if (offlineUser) {
        await Admin.findByIdAndUpdate(offlineUser, { online: false });

        // ✅ Notify all others this user went offline
        socket.broadcast.emit("userOffline", offlineUser);

        broadcastUsers();
      }
    });
  });

  return io;
};
