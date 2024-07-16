import catchAsync from '../util/catchAsync.js';
import projectModel from '../models/projectModel.js';
import blogModel from '../models/blogModel.js';
import careerModel from '../models/careerModel.js';
import mongoose from 'mongoose';
import BlogImages from '../models/blogImagesModal.js';
import AppError from '../util/AppError.js';

const metaTags = {
    title: "",
    description:""
};

export const homePage = catchAsync(async (req, res, next) => {
  metaTags.title = "Home - Astrik International Ltd";
  metaTags.description = "ASTRIK International Ltd is an experienced, privately owned Engineering Consulting Company with its office based in Kigali City of Kigali, Rwanda. Since its incorporation in January 2014, the Company has entered into partnerships with highly recognized International Organizations/Institutions, which operate at the forefront of technical excellence in developing professional engineering service and infrastructure solutions globally.";
    
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
    metaTags,
    projects,
    blog
  });
});

export const contactPage = catchAsync(async (req, res, next) => { 
  metaTags.title = "Contact us - Astrik International Ltd";
  metaTags.description = "Get in touch with us";
  res.status(200).render('contact',{
    metaTags,
  });
});

export const careerPage = catchAsync(async (req, res, next) => { 
  metaTags.title = "Careers - Astrik International Ltd";
  metaTags.description = "Get an opportunity to work with us";

  const jobs = await careerModel.find();

  res.status(200).render('careers',{
    metaTags,
    jobs
  });
});

export const servicesPage = catchAsync(async (req, res, next) => { 
  metaTags.title = "Service - Astrik International Ltd";
  metaTags.description = "Get an opportunity to work with us";
  res.status(200).render('services',{
    metaTags
  });
});

export const trainingPage = catchAsync(async (req, res, next) => {
  metaTags.title = "Training center - Astrik International Ltd";
  metaTags.description = "We offers various training and capacity building programs, skill development & field investigation modules which are internationally accredited.";
  res.status(200).render('training',{
    metaTags
  });
});

export const loginPage = catchAsync(async (req, res, next) => {
  metaTags.title = "Login - Astrik International Ltd";
  metaTags.description = null;
  res.status(200).render('login', {
    metaTags
  });
});

export const blogsPage = catchAsync(async (req, res, next) => {
  metaTags.title = "News - Astrik International Ltd";
  metaTags.description = "View the latest news and activites ";
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
    metaTags,
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

  metaTags.title = blog[0].title;
  metaTags.description = blog[0].body;

  res.status(200).render('blog-details', {
    metaTags,
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

  metaTags.title = project[0].name;
  metaTags.description = project[0].description;

  res.status(200).render('project-details', {
    metaTags,
    project: project[0],
    projects,
  });
});
export const jobPage = catchAsync(async (req, res, next) => {
  const { id } = req.params;


  const job = await careerModel.findById(id)
  if (!job) {
    return next(new AppError('No job found with that ID', 404));
  }

  metaTags.title = job.title;
  metaTags.description = job.description;

  res.status(200).render('job-details', {
    metaTags,
    job,
  });
});

export const projectsPage = catchAsync(async (req, res, next) => {
  metaTags.title = "Projects - Astrik International Ltd";
  metaTags.description = "Our latest projects";
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
    metaTags,
    projects,
  });
});

export const resetpassword = catchAsync(async (req, res, next) => {
  metaTags.title = "Reset password - Astrik International Ltd";
  metaTags.description = null;
  const { token } = req.params;
  res.status(200).render('reset-password', {
    token,
    metaTags
  });
});

export const forgotPage = catchAsync(async (req, res, next) => {
  metaTags.title = "Forgot password - Astrik International Ltd";
  metaTags.description = null;
  res.status(200).render('forgot-password', {
    metaTags
  });
});

export const aboutPage = catchAsync(async (req, res, next) => {
  metaTags.title = "About us - Astrik International Ltd";
  metaTags.description = "since its incorporation in 2014, the company has entered into partnerships with highly recognized international organizations/institutions, which operate at the forefront of technical excellence in developing infrastructure solutions around the world.";
  res.status(200).render('about',{
    metaTags
  });
});
