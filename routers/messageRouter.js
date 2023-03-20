import express from 'express';
import { protect, restrictedTo } from '../controllers/authController.js';
import {
  getMessages,
  createMessage,
  getMessage,
  deleteMessage
} from '../controllers/messagesController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, restrictedTo('admin'), getMessages)
  .post(createMessage);

router
  .route('/:id')
  .get(protect, restrictedTo('admin'), getMessage)
  .delete(protect, restrictedTo('admin'), deleteMessage);

export default router;
