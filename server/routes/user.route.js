import express from 'express';
import {
    getUser,
    updateUser,
    deleteUser,
    createUser,
    getAllUsers
} from '../controllers/user.controller.js';

const router = express.Router();

// CRUD operations
router.get('/', getAllUsers);           // Get all users
router.get('/:id', getUser);           // Get specific user
router.post('/create', createUser);          // Create new user
router.patch('/update/:id', updateUser);      // Update user (simplified path)
router.delete('/delete/:id', deleteUser);     // Delete user (simplified path)

export default router;