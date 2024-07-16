import express from 'express';
import {
  aboutPage,
  blogsPage,
  contactPage,
  homePage,
  projectsPage,
  projectPage,
  loginPage,
  trainingPage,
  forgotPage,
  servicesPage,
  blogPage,
  resetpassword,
  careerPage,
  jobPage,
} from '../controllers/viewController.js';

import { isLoggedIn, protect } from '../controllers/authController.js';
import {
  adminPage,
  adminBlogsPage,
  adminCommentsPage,
  adminMessagesPage,
  adminProjectsPage,
  adminSubscribersPage,
  adminProjectImagesPage,
  adminUsersPage,
  adminProfilePage,
  adminBlogImagesPage,
  adminCareerPage,
  adminTrainingsPage,
  adminJobApplicantsPage,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(isLoggedIn);
router.get('/', homePage);
router.get('/training', trainingPage);
router.get('/about', aboutPage);
router.get('/careers', careerPage);
router.get('/career-details/:id', jobPage);
router.get('/projects', projectsPage);
router.get('/projects/:id', projectPage);
router.get('/services', servicesPage);
router.get('/news', blogsPage);
router.get('/news/:id', blogPage);
router.get('/login', loginPage);
router.get('/forgot', forgotPage);
router.get('/contact', contactPage);
router.get('/resetpassword/:token', resetpassword);

router.get('/admin', protect, adminPage);
router.get('/admin/trainings', protect, adminTrainingsPage);
router.get('/admin/blogs', protect, adminBlogsPage);
router.get('/admin/blogs/:id', protect, adminBlogImagesPage);
router.get('/admin/blogs/comments/:id', protect, adminCommentsPage);
router.get('/admin/messages', protect, adminMessagesPage);
router.get('/admin/applicants', protect, adminJobApplicantsPage);
router.get('/admin/subscribers', protect, adminSubscribersPage);
router.get('/admin/projects', protect, adminProjectsPage);
router.get('/admin/projects/:id', protect, adminProjectImagesPage);
router.get('/admin/users', protect, adminUsersPage);
router.get('/admin/careers', protect, adminCareerPage);
router.get('/admin/profile', protect, adminProfilePage);

export default router;
