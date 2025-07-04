import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { dbConnect } from './libs/dbConnect.js';
import userRouter from './routes/user.route.js';
import { errorHandler } from './libs/middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Middleware for parsing JSON
app.use(express.json());

// Routes
app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => {
    res.status(200).json({message: 'Welcome to the Taskly!'});
});

// Error handler
app.use(errorHandler);

// 404 handler 
app.use((req, res) => {
    res.status(404).json({message: 'Route not found'});
});

app.listen(PORT, async () => {
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