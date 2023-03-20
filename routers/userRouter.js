import express from 'express';
import {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
  restrictedTo
} from '../controllers/authController.js';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteMe,
  getMe,
  uploadUserImage,
  resizeUserPhoto,
  subscription
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);

router.use(protect);
router.get('/me', getMe);
router.patch('/updatepassword', updatePassword);
router.route('/updateMe').patch(uploadUserImage, resizeUserPhoto, updateUser);
router.route('/deleteMe').delete(deleteMe);
router.get('/subscription', subscription);

router.use(restrictedTo('admin'));
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser);

export default router;
