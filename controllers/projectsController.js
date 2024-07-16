import catchAsync from '../util/catchAsync.js';
import AppError from '../util/AppError.js';
import projectModel from '../models/projectModel.js';
import projectImageModal from '../models/projectImagesModal.js';
import { fileUpload } from '../util/multer.js';
import decode from 'decode-html';

export const getProjects = catchAsync(async (req, res, next) => {
  const projects = await projectModel.find();

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects
    }
  });
});

export const getProject = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const project = await projectModel.findById(id);
  if (!project) {
    return next(new AppError('No Project found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

export const deleteProject = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const project = await projectModel.deleteOne({ _id: id });

  if (!project) {
    return next(new AppError('No Project found with that ID', 404));
  }
  await projectImageModal.deleteMany({ project: id });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const createProject = catchAsync(async (req, res, next) => {
  req.body.description = decode(req.body.description);
  let project = await projectModel.create(req.body);

  if (req.file) {
    req.body.image = await fileUpload(req);
  } else {
    req.body.image = "https://res.cloudinary.com/dvibmdi1y/image/upload/v1681214827/astrik/images/background/aene4yzyd6ptswi4mx7u_n14bcd.jpg"
  }

  const projectImage = await projectImageModal.create({ project: project._id, image: req.body.image });
  project.image = projectImage;

  res.status(201).json({
    status: 'success',
    data: {
      project
    }
  });
});

export const createProjectImage = catchAsync(async (req, res, next) => {

  if (!req.file) {
    return next(new AppError('Image required', 400));
  }
  req.body.image = await fileUpload(req);
  req.body.project = req.params.id;
  const projectImage = await projectImageModal.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      projectImage
    }
  });
});

export const updateProject = catchAsync(async (req, res, next) => {
  if (req.body.description) req.body.description = decode(req.body.description);
  const project = await projectModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!project) {
    return next(new AppError('No Project found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: project
    }
  });
});
export const updateProjectImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Image required', 400));
  }

  req.body.image = await fileUpload(req);

  const image = await projectImageModal.findByIdAndUpdate(req.params.id, { image: req.body.image }, {
    new: true,
    runValidators: true
  });

  if (!image) {
    return next(new AppError('No image found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: image
    }
  });
});

export const deleteProjectImage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const image = await projectImageModal.deleteOne({ _id: id });
  if (!image) {
    return next(new AppError('No image found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
