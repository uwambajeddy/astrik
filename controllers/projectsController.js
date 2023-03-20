import sharp from 'sharp';
import multer from 'multer';
import catchAsync from '../util/catchAsync.js';
import AppError from '../util/AppError.js';
import projectModel from '../models/projectModel.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

export const uploadProjectImage = upload.single('image');

export const resizeProjectPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.originalname = `project-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(340, 340)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/project/${req.file.originalname}`);

  next();
});

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
  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const createProject = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.originalname;

  const project = await projectModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      project
    }
  });
});

export const updateProject = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.originalname;

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
