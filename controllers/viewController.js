import catchAsync from '../util/catchAsync.js';
import projectModel from '../models/projectModel.js';
import blogModel from '../models/blogModel.js';
import mongoose from 'mongoose';
import BlogImages from '../models/blogImagesModal.js';

export const homePage = catchAsync(async (req, res, next) => {
  const projects = await projectModel.aggregate([
    {
      $lookup: {
        from: 'projectimages',
        as: 'images',
        let: { project: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$project', '$$project'] }
            },
          },
        ],
      },
    },
  ]);

  const blog = await blogModel.aggregate([
    {
      $lookup: {
        from: 'blogimages',
        as: 'images',
        let: { blog: '$_id' },
        pipeline: [
          {
            $match: { $expr: { $eq: ['$blog', '$$blog'] } },
          },
        ],
      },
    },
  ]);

  res.status(200).render('index', {
    projects,
    blog
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
  const blogImages = await BlogImages.find();
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
    blogImages
  });
});

export const blogPage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const blogs = await blogModel.aggregate([
    {
      $lookup: {
        from: 'blogimages',
        as: 'images',
        let: { blog: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$blog', '$$blog'] }
            },
          },
        ],
      },
    },
  ]);

  const blog = await blogModel.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: 'comments',
        as: 'comments',
        let: { blog: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$blog', '$$blog'] },
              approve: true,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'blogimages',
        as: 'images',
        let: { blog: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$blog', '$$blog'] }
            },
          },
        ],
      },
    },
  ]);
  if (!blog) {
    return next(new AppError('No Blog found with that ID', 404));
  }

  res.status(200).render('blog-details', {
    blog: blog[0],
    blogs,
  });
});

export const projectPage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const projects = await projectModel.aggregate([
    {
      $lookup: {
        from: 'projectimages',
        as: 'images',
        let: { project: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$project', '$$project'] }
            },
          },
        ],
      },
    },
  ]);

  const project = await projectModel.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: 'projectimages',
        as: 'images',
        let: { project: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$project', '$$project'] }
            },
          },
        ],
      },
    },
  ]);
  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }

  res.status(200).render('project-details', {
    project: project[0],
    projects,
  });
});

export const projectsPage = catchAsync(async (req, res, next) => {
  const projects = await projectModel.aggregate([
    {
      $lookup: {
        from: 'projectimages',
        as: 'images',
        let: { project: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$project', '$$project'] }
            },
          },
        ],
      },
    },
  ]);

  res.status(200).render('project', {
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
