import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './Routes/adminRoute.js';
import doctorRouter from './Routes/doctorRoute.js';
import userRouter from './Routes/userRoute.js';

const app = express();
const PORT = process.env.PORT || 4000;

// connect DB
connectDB();
connectCloudinary();

// allowed origins
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'];

// middleware
app.use(helmet());
app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        return cb(null, false);
    },
    credentials: true
}));
app.use(express.json());

// general API rate limit
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Too many requests, try again later' }
});
app.use('/api', apiLimiter);

// stricter limit for login routes
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many login attempts, try again later' }
});
app.use('/api/admin/login', loginLimiter);
app.use('/api/user/login', loginLimiter);
app.use('/api/user/register', loginLimiter);

// routes
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

// test route
app.get('/', (req, res) => {
    res.send('API is working');
});

// global error handler
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Max size is 5 MB.' });
    }
    if (err.message && err.message.includes('Only image files')) {
        return res.status(400).json({ success: false, message: err.message });
    }
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

export default app;