import express from 'express';
import { protect } from '../controllers/authController.js';
import {
  updateBlogImage,
  deleteBlogImage,
  createBlogImage
} from '../controllers/blogsController.js';
import { uploads } from '../util/multer.js';

const router = express.Router();

router
  .route('/:id')
  .patch(protect, uploads.single("image"), updateBlogImage)
  .post(protect, uploads.single("image"), createBlogImage)
  .delete(protect, deleteBlogImage);


export default router;
