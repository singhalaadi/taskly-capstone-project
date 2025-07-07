import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { dbConnect } from './libs/dbConnect.js';
import userRouter from './routes/user.route.js';
import cldRouter from './routes/cloudinary.route.js';
import taskRouter from './routes/task.route.js';
import { errorHandler } from './middlewares/middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for all routes
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware for parsing JSON and cookies
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));

// File upload middleware
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    abortOnLimit: true,
    responseOnLimit: "File size limit has been reached",
    createParentPath: true
}));

// Serve static files from assets folder
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/image', cldRouter);
app.use('/api/v1/tasks', taskRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Taskzy!',
        version: '1.0.0',
        endpoints: {
            users: '/api/v1/users',
            register: '/api/v1/users/register',
            login: '/api/v1/users/login',
            upload: '/api/v1/image/upload',
            assets: '/assets'
        }
    });
});

// Error handler
app.use(errorHandler);

// 404 handler 
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        availableRoutes: [
            'GET /',
            'GET /api/v1/users',
            'POST /api/v1/users/register',
            'POST /api/v1/users/login',
            'POST /api/v1/image/upload',
            'GET /assets/*'
        ]
    });
});

app.listen(PORT, '0.0.0.0', async () => {
    try {
        await dbConnect();
        console.log(`Database connected successfully`);
        console.log(`Server running on port ${PORT}`);
        console.log(`Visit: http://localhost:${PORT}`);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});