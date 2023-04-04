import catchAsync from '../util/catchAsync.js';
import projectModel from '../models/projectModel.js';
import blogModel from '../models/blogModel.js';
import userModel from '../models/userModel.js';
import mongoose from 'mongoose';

export const homePage = catchAsync(async (req, res, next) => {
  const projects = await projectModel.find();

  res.status(200).render('index', {
    projects,
  });
});

export const contactPage = catchAsync(async (req, res, next) => { 
  res.status(200).render('contact');
});

export const servicesPage = catchAsync(async (req, res, next) => { 
  res.status(200).render('services');
});

export const trainingPage = catchAsync(async (req, res, next) => {
  res.status(200).render('training');
});

export const loginPage = catchAsync(async (req, res, next) => {
  res.status(200).render('login');
});
export const signupPage = catchAsync(async (req, res, next) => {
  res.status(200).render('signup');
});

export const blogsPage = catchAsync(async (req, res, next) => {
  const admin = await userModel.aggregate([{ $match: { role: 'admin' } }]);
  const blogs = await blogModel.aggregate([
    {
      $lookup: {
        from: 'comments',
        as: 'comments',
        let: { blog: '$_id' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$blog', '$$blog'] }, approve: true },
          },
        ],
      },
    },
  ]);

  res.status(200).render('blog', {
    blogs,
    admin: admin[0],
  });
});

export const blogPage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // const admin = await userModel.find({ role: 'admin' });
  // const blogs = await blogModel.aggregate([
  //   {
  //     $lookup: {
  //       from: 'comments',
  //       as: 'comments',
  //       let: { blog: '$_id' },
  //       pipeline: [
  //         {
  //           $match: { $expr: { $eq: ['$blog', '$$blog'] }, approve: true },
  //         },
  //       ],
  //     },
  //   },
  // ]);

  // const blog = await blogModel.aggregate([
  //   {
  //     $match: { _id: mongoose.Types.ObjectId(id) },
  //   },
  //   {
  //     $lookup: {
  //       from: 'comments',
  //       as: 'comments',
  //       let: { blog: '$_id' },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: { $eq: ['$blog', '$$blog'] },
  //             approve: true,
  //           },
  //         },
  //         {
  //           $unwind: '$user',
  //         },
  //         {
  //           $lookup: {
  //             from: 'users',
  //             localField: 'user',
  //             foreignField: '_id',
  //             as: 'user',
  //           },
  //         },
  //         {
  //           $unset: ['user.password', 'user.role', 'user.active', 'user.email'],
  //         },
  //       ],
  //     },
  //   },
  // ]);
  // if (!blog) {
  //   return next(new AppError('No Blog found with that ID', 404));
  // }

  res.status(200).render('blog-details', {
    // blog: blog[0],
    // blogs,
    // admin: admin[0],
  });
});

export const projectsPage = catchAsync(async (req, res, next) => {
  const projects = await projectModel.find();

  res.status(200).render('project', {
    projects,
  });
});
export const projectPage = catchAsync(async (req, res, next) => {
  const projects = await projectModel.find();

  res.status(200).render('project-details', {
    projects,
  });
});

export const subscription = catchAsync(async (req, res, next) => {
  res.status(200).render('unsubscribe');
});
export const resetpassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  res.status(200).render('reset-password', {
    token,
  });
});

export const forgotPage = catchAsync(async (req, res, next) => {
  res.status(200).render('forgot-password');
});

export const aboutPage = catchAsync(async (req, res, next) => {
  res.status(200).render('about');
});
