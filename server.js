import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './Routes/adminRoute.js';

const app = express();
const PORT = process.env.PORT || 4000;

// connect DB
connectDB();
connectCloudinary();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/admin', adminRouter);

// test route
app.get('/', (req, res) => {
    res.send('API is working');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
