import express from 'express';
import { protect, restrictedTo } from '../controllers/authController.js';
import {
  getProjects,
  createProject,
  getProject,
  deleteProject,
  updateProject,
  resizeProjectPhoto,
  uploadProjectImage
} from '../controllers/projectsController.js';

const router = express.Router();

router
  .route('/:id')
  .get(getProject)
  .patch(protect, restrictedTo('admin'), uploadProjectImage, resizeProjectPhoto, updateProject)
  .delete(protect, restrictedTo('admin'), deleteProject);

router
  .route('/')
  .get(getProjects)
  .post(protect, restrictedTo('admin'), uploadProjectImage, resizeProjectPhoto, createProject);


export default router;
