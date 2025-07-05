import express from 'express';
import {
    getUser,
    updateUser,
    deleteUser,
    register,
    login,
    logout,
    getAllUsers
} from '../controllers/user.controller.js';
import { verifyToken } from "../libs/middleware.js";

const router = express.Router();

// Auth routes
router.post('/register', register);        // POST /api/v1/users/register
router.post('/login', login);             // POST /api/v1/users/login
router.post('/logout', logout);           // POST /api/v1/users/logout

// CRUD routes
router.get('/',verifyToken, getAllUsers);             // GET /api/v1/users
router.get('/:id',verifyToken, getUser);             // GET /api/v1/users/:id
router.patch('/update/:id',verifyToken, updateUser);  // PATCH /api/v1/users/update/:id
router.delete('/delete/:id',verifyToken, deleteUser); // DELETE /api/v1/users/delete/:id

export default router;