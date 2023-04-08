import express from 'express';
import { protect } from '../controllers/authController.js';
import {
  getBlogs,
  createBlog,
  getBlog,
  deleteBlog,
  updateBlog,
  deleteComment,
  createComment,
  approveComment,
  getAllComments,
} from '../controllers/blogsController.js';
import { uploads } from '../util/multer.js';

const router = express.Router();

router
  .route('/')
  .get(getBlogs)
  .post(protect, uploads.single("image"), createBlog);

router
  .route('/:id')
  .get(getBlog)
  .patch(protect,  updateBlog)
  .delete(protect, deleteBlog);


router
  .route('/comment/:id')
  .get(protect, getAllComments)
  .post(createComment);

router
  .route('/comment/approve/:id')
  .get(protect, approveComment);
router
  .route('/comment/delete/:id')
  .delete(protect, deleteComment);



export default router;
