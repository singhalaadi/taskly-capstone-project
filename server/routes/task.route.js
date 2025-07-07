import express from 'express';
import {
    getTask,
    getTasksByUser,
    createTask,
    updateTask,
    deleteTask,
} from '../controllers/task.controller.js';
import { verifyToken } from '../middlewares/middleware.js';

const router = express.Router();
router.post('/create', verifyToken, createTask);       // POST /api/v1/tasks/create
router.get('/user/:id', verifyToken, getTasksByUser);  // GET /api/v1/tasks/user/123
router.get('/:id', verifyToken, getTask);              // GET /api/v1/tasks/123
router.patch('/:id', verifyToken, updateTask);         // PATCH /api/v1/tasks/123
router.delete('/:id', verifyToken, deleteTask);        // DELETE /api/v1/tasks/123
export default router;