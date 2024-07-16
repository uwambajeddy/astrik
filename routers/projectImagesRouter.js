import express from 'express';
import { protect } from '../controllers/authController.js';
import {
  updateProjectImage,
  deleteProjectImage,
  createProjectImage
} from '../controllers/projectsController.js';
import { uploads } from '../util/multer.js';

const router = express.Router();

router
  .route('/:id')
  .patch(protect, uploads.single("image"), updateProjectImage)
  .post(protect, uploads.single("image"), createProjectImage)
  .delete(protect, deleteProjectImage);


export default router;
