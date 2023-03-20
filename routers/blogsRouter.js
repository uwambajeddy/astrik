import express from 'express';
import { protect, restrictedTo } from '../controllers/authController.js';
import {
  getBlogs,
  createBlog,
  getBlog,
  deleteBlog,
  updateBlog,
  handleLike,
  deleteComment,
  createComment,
  approveComment,
  getAllComments,
  uploadBlogImage,
  resizeBlogPhoto
} from '../controllers/blogsController.js';

const router = express.Router();

router
  .route('/:id')
  .get(getBlog)
  .patch(protect, restrictedTo('admin'), uploadBlogImage, resizeBlogPhoto, updateBlog)
  .delete(protect, restrictedTo('admin'), deleteBlog);

router.route('/like/:id').post(protect, handleLike);

router
  .route('/comment/:id')
  .get(protect, restrictedTo('admin'), getAllComments)
  .post(protect, createComment);

router
  .route('/comment/approve/:id')
  .get(protect, restrictedTo('admin'), approveComment);
router
  .route('/comment/delete/:id')
  .delete(protect, restrictedTo('admin'), deleteComment);

router
  .route('/')
  .get(getBlogs)
  .post(protect, restrictedTo('admin'), uploadBlogImage, resizeBlogPhoto, createBlog);


export default router;
