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

  // Broadcast updated user list (for Admin dashboard)
 const broadcastUsers = async () => {
  try {
    const users = await Admin.find({ role: "user" }).lean();
    const admin = await Admin.findOne({ role: "admin" }).lean();

    if (!admin) return;

    const finalUsers = await Promise.all(
      users.map(async (u) => {
        // 🔴 Unseen count from user → admin
        const unseenToAdmin = await Message.countDocuments({
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
          unseen: unseenToAdmin,
        };
      })
    );

    // ✅ Send full user list to admin dashboard
    const adminSockets = onlineUsers.get(String(admin._id));
    if (adminSockets) {
      adminSockets.forEach((sid) => {
        io.to(sid).emit("usersList", finalUsers);
      });
    }

    // ✅ Broadcast online users (for both sides)
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    // ✅ Emit unseen count to each user individually (admin → user)
    for (const u of finalUsers) {
      const userSockets = onlineUsers.get(String(u._id));
      if (userSockets) {
        const unseenToUser = await Message.countDocuments({
          senderId: admin._id,
          receiverId: u._id,
          seen: false,
        });
        userSockets.forEach((sid) => {
          io.to(sid).emit("unseenCount", unseenToUser);
        });
      }
    }

    // ✅ Emit total unseen (users → admin)
    const totalUnseen = finalUsers.reduce((sum, u) => sum + u.unseen, 0);
    if (adminSockets) {
      adminSockets.forEach((sid) => {
        io.to(sid).emit("unseenCount", totalUnseen);
      });
    }

  } catch (err) {
    console.error("Broadcast users error:", err);
  }
};


  io.on("connection", (socket) => {
    // ✅ JOIN EVENT
    socket.on("join", async ({ userId }) => {
      const id = String(userId);
      if (!onlineUsers.has(id)) onlineUsers.set(id, new Set());
      onlineUsers.get(id).add(socket.id);

      await Admin.findByIdAndUpdate(id, { online: true });
      socket.join(id);

      socket.broadcast.emit("userOnline", id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys())); // ✅ notify all

      // send current online list to the connected socket
      socket.emit("onlineUsers", Array.from(onlineUsers.keys()));

      await broadcastUsers();
    });

    // ✅ Manual request for online users
    socket.on("getOnlineUsers", () => {
      socket.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    // ✅ FIXED TYPING (emit only to receiver)
    socket.on("typing", ({ senderId, receiverId }) => {
      io.to(String(receiverId)).emit("typing", senderId);
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
      io.to(String(receiverId)).emit("stopTyping", senderId);
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

        await broadcastUsers();
        if (ack) ack({ ok: true });
      } catch (err) {
        console.log("Socket error:", err);
        if (ack) ack({ ok: false });
      }
    });

    // ✅ MARK SEEN
    socket.on("markSeen", async ({ userId, fromId }) => {
      try {
        await Message.updateMany(
          { senderId: fromId, receiverId: userId, seen: false },
          { seen: true, readAt: new Date() }
        );
        await broadcastUsers();
      } catch (err) {
        console.error("MarkSeen error:", err);
      }
    });

    // ✅ DISCONNECT HANDLER
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
        socket.broadcast.emit("userOffline", offlineUser);
        io.emit("onlineUsers", Array.from(onlineUsers.keys())); // ✅ update all
        await broadcastUsers();
      }
    });
  });

  console.log("✅ Socket.IO server initialized");
  return io;
};
