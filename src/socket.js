import { Server } from "socket.io";
import Message from "./models/Message.js";
import Admin from "./models/Admin.js";
import imageToBase64 from "../src/utils/imageToBase64.js";

const onlineUsers = new Map(); // userId -> socketId

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  // Function: Broadcast LIVE users list (online + offline + unseen count)
  const broadcastUsers = async () => {
    const users = await Admin.find({ role: "user" }).lean(); // ✅ Only users

    const finalUsers = await Promise.all(
      users.map(async (u) => {
        const unseen = await Message.countDocuments({
          receiverId: u._id,
          seen: false,
        });

        // ✅ Convert profile image to BASE64
        let base64Image = "";
        if (u.profileImage) {
          try {
            base64Image = await imageToBase64(u.profileImage);
          } catch (err) {
            base64Image = ""; // fallback
          }
        }

        return {
          ...u,
          profileImage: base64Image, // ✅ Replace with base64
          online: onlineUsers.has(String(u._id)),
          unseen,
        };
      })
    );

    io.emit("usersList", finalUsers);
  };

  io.on("connection", (socket) => {
    // ✅ User joins socket (login)
    socket.on("join", async ({ userId }) => {
      onlineUsers.set(String(userId), socket.id);

      // mark user online in DB
      await Admin.findByIdAndUpdate(userId, { online: true });

      // broadcast live list
      broadcastUsers();
    });

    // ✅ TYPING START
    socket.on("typing", (userId) => {
      for (const [uid, sid] of onlineUsers) {
        if (sid === socket.id) continue;
        io.to(sid).emit("typing", userId);
      }
    });

    // ✅ TYPING STOP
    socket.on("stopTyping", (userId) => {
      for (const [uid, sid] of onlineUsers) {
        if (sid === socket.id) continue;
        io.to(sid).emit("stopTyping", userId);
      }
    });

    // ✅ MESSAGE SEND
    socket.on("sendMessage", async (payload, ack) => {
      try {
        const { senderId, receiverId, message } = payload;

        const doc = await Message.create({
          senderId,
          receiverId,
          message,
        });

        // send message to sender
        io.to(socket.id).emit("receiveMessage", {
          _id: doc._id,
          senderId,
          receiverId,
          message,
          createdAt: doc.createdAt,
        });

        // send message to receiver
        const recvSocket = onlineUsers.get(String(receiverId));
        if (recvSocket) {
          io.to(recvSocket).emit("receiveMessage", {
            _id: doc._id,
            senderId,
            receiverId,
            message,
            createdAt: doc.createdAt,
          });
        }

        // ✅ unseen count changed, update LIVE user list
        broadcastUsers();

        if (ack) ack({ ok: true });
      } catch (err) {
        console.log("Socket Error:", err);
        if (ack) ack({ ok: false });
      }
    });

    // ✅ DISCONNECT
    socket.on("disconnect", async () => {
      let offlineUser = null;

      for (const [uid, sid] of onlineUsers) {
        if (sid === socket.id) {
          offlineUser = uid;
          onlineUsers.delete(uid);
        }
      }

      if (offlineUser) {
        await Admin.findByIdAndUpdate(offlineUser, { online: false });
        broadcastUsers();
      }
    });
  });

  return io;
};
