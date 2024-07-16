import express from 'express';
import { protect } from '../controllers/authController.js';
import { createApplication, createJob, deleteApplication, deleteJob, getApplication, getApplications, getJob, getJobs, updateJob } from '../controllers/careerController .js';
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

router
  .route('/apply/:id')
  .get(getApplication)
  .delete(protect, deleteApplication);
router
  .route('/apply')
  .get(getApplications)
  .post(protect, createApplication);


export default router;
