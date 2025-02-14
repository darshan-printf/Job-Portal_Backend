import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import rootRouter from './routes/index.js';
// Load environment variables
dotenv.config();
const app = express();
// Connect to MongoDB
connectDB();
app.use(express.json());
app.use('/api', rootRouter); 
app.get('/', (req, res) => {
    res.send('Hello, MongoDB!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`⚙️  Server is running on port:${PORT}`);
    // hello this is demo test for git 
});
