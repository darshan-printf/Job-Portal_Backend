import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import rootRouter from './routes/index.js';
import cors from 'cors';
import path from 'path';
// Load environment variables
dotenv.config();
const app = express();
app.use(cors());
// Connect to MongoDB
connectDB();
app.use(express.json());
// ✅ __dirname setup (ES module ke liye)
const __dirname = path.resolve();

// ✅ Static uploads folder serve karna
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', rootRouter);

const PORT = process.env.PORT ;
app.listen(PORT, () => {
    console.log(`⚙️  Server is running on port:${PORT}`);
});
