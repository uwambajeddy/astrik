import express from 'express';
import { protect } from '../controllers/authController.js';
import { createJob, deleteJob, getJob, getJobs, updateJob } from '../controllers/careerController .js';
const router = express.Router();

router
  .route('/:id')
  .get(getJob)
  .patch(protect, updateJob)
  .delete(protect, deleteJob);

router
  .route('/')
  .get(getJobs)
  .post(protect, createJob);


export default router;
