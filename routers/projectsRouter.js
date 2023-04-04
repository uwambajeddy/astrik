import express from 'express';
import { protect } from '../controllers/authController.js';
import {
  getProjects,
  createProject,
  getProject,
  deleteProject,
  updateProject,
} from '../controllers/projectsController.js';
import { uploads } from '../util/multer.js';

const router = express.Router();

router
  .route('/:id')
  .get(getProject)
  .patch(protect, uploads.single("image"), updateProject)
  .delete(protect, deleteProject);

router
  .route('/')
  .get(getProjects)
  .post(protect, uploads.single("image"), createProject);


export default router;
