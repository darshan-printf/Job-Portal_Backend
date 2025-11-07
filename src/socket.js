import { Server } from "socket.io";
import Message from "./models/Message.js";

const onlineUsers = new Map();

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    socket.on("join", ({ userId }) => {
      onlineUsers.set(String(userId), socket.id);
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

        const doc = await Message.create({ senderId, receiverId, message });

        // Send to self
        io.to(socket.id).emit("receiveMessage", {
          _id: doc._id,
          senderId,
          receiverId,
          message,
          createdAt: doc.createdAt,
        });

        // Send to receiver
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

        if (ack) ack({ ok: true });

      } catch (err) {
        console.log("Socket Error:", err);
        if (ack) ack({ ok: false });
      }
    });

    socket.on("disconnect", () => {
      for (const [id, sid] of onlineUsers) {
        if (sid === socket.id) onlineUsers.delete(id);
      }
    });
  });

  return io;
};
