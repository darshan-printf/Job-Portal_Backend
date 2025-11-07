// socket.js
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

    socket.on("disconnect", () => {
      for (const [id, sid] of onlineUsers) {
        if (sid === socket.id) onlineUsers.delete(id);
      }
    });
  });

  return io;
};
