import express from 'express';
import { addImage } from '../controllers/cloudinary.controller.js';
import { verifyToken } from '../middlewares/middleware.js';

const router = express.Router();

router.post('/upload', verifyToken, addImage);

export default router;