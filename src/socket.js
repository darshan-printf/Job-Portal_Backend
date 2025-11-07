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

      // ✅ Broadcast user is online
      io.emit("userOnline", userId);
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

    // ✅ MESSAGE SEND (unchanged)
    socket.on("sendMessage", async (payload, ack) => {
      try {
        const { senderId, receiverId, message } = payload;

        const doc = await Message.create({ senderId, receiverId, message });

        io.to(socket.id).emit("receiveMessage", {
          _id: doc._id,
          senderId,
          receiverId,
          message,
          createdAt: doc.createdAt,
        });

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

    // ✅ DISCONNECT
    socket.on("disconnect", () => {
      let offlineUser = null;

      for (const [id, sid] of onlineUsers) {
        if (sid === socket.id) {
          offlineUser = id;
          onlineUsers.delete(id);
        }
      }

      // ✅ Broadcast offline status
      if (offlineUser) {
        io.emit("userOffline", offlineUser);
      }
    });

  });

  return io;
};
