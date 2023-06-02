import express from 'express';
import { protect } from '../controllers/authController.js';
import { createTraining, deleteTraining, getTraining, getTrainings } from '../controllers/trainingController.js';

const router = express.Router();

router
  .route('/:id')
  .get(getTraining)
  .delete(protect, deleteTraining);

router
  .route('/')
  .get(getTrainings)
  .post(createTraining);


export default router;
