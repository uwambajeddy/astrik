import express from 'express';
import { protect } from '../controllers/authController.js';
import {
  getMessages,
  createMessage,
  getMessage,
  deleteMessage
} from '../controllers/messagesController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getMessages)
  .post(createMessage);

router
  .route('/:id')
  .get(protect, getMessage)
  .delete(protect, deleteMessage);

export default router;
