import express from 'express';
import { addMessage, getAllMessages } from '../controller/MessageController.js';
import { authenticateToken } from '../controller/jwt_controller.js';
const router = express.Router();

// add message and get messages
router.post('/add',authenticateToken, addMessage);
router.post('/', getAllMessages);

export default router;