import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import rootRouter from './routes/index.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import http from 'http';
import { Server } from 'socket.io';
import Message from './models/Message.js';

dotenv.config();

const app = express();

// ✅ FIX 1 — FULL CORS FIX (MOST IMPORTANT)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// ✅ FIX 2 — Preflight request handling
app.options("*", cors());

app.use(express.json());

// ✅ FIX 3 — dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Connect DB
connectDB();

// ✅ API Routes
app.use('/api', rootRouter);

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ FIX 4 — Socket.io with correct CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }
});

// ✅ Online users map
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log("✅ Socket connected:", socket.id);

  // ✅ join room
  socket.on('join', ({ userId }) => {
    onlineUsers.set(String(userId), socket.id);
  });

  // ✅ send message
  socket.on('sendMessage', async (payload, ack) => {
    try {
      const { senderId, receiverId, message } = payload;

      const doc = await Message.create({ senderId, receiverId, message });

      // send to sender
      io.to(socket.id).emit("receiveMessage", {
        _id: doc._id,
        senderId, receiverId, message,
        createdAt: doc.createdAt,
      });

      // send to receiver
      const recvSocket = onlineUsers.get(String(receiverId));
      if (recvSocket) {
        io.to(recvSocket).emit("receiveMessage", {
          _id: doc._id,
          senderId, receiverId, message,
          createdAt: doc.createdAt,
        });
      }

      if (ack) ack({ ok: true });

    } catch (err) {
      console.log("Socket error:", err);
      if (ack) ack({ ok: false, error: err.message });
    }
  });

  // ✅ disconnect
  socket.on("disconnect", () => {
    for (const [id, sid] of onlineUsers) {
      if (sid === socket.id) onlineUsers.delete(id);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
