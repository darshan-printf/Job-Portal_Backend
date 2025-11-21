import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import rootRouter from './routes/index.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import http from 'http';
import { initSocket } from './socket.js';

dotenv.config();

const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect DB
connectDB();

// API
app.use('/api', rootRouter);

// HTTP server banate hain
const server = http.createServer(app);

// ✅ Socket.io ko init karo
initSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});