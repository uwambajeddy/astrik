import catchAsync from '../util/catchAsync.js';
import AppError from '../util/AppError.js';
import careerModel from '../models/careerModel.js';
import applicationModel from '../models/applicationModal.js';
import decode from 'decode-html';
import { fileUpload } from '../util/multer.js';



export const getJobs = catchAsync(async (req, res, next) => {
  const careers = await careerModel.find();

  res.status(200).json({
    status: 'success',
    results: careers.length,
    data: {
      careers,
    },
  });
});

export const getJob = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const career = await careerModel.find({ _id: id });
  if (!career) {
    return next(new AppError('No Job found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      career,
    },
  });
});

export const deleteJob = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const career = await careerModel.deleteOne({ _id: id });

  if (!career) {
    return next(new AppError('No Job found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createJob = catchAsync(async (req, res, next) => {

  req.body.body = decode(req.body.body);
  let career = await careerModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      career
    },
  });
});

export const updateJob = catchAsync(async (req, res, next) => {
  if (req.body.body) req.body.body = decode(req.body.body);
  const career = await careerModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!career) {
    return next(new AppError('No Job found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: career,
    },
  });
});




export const getApplications = catchAsync(async (req, res, next) => {
  const applications = await applicationModel.find();

  res.status(200).json({
    status: 'success',
    results: applications.length,
    data: {
      applications,
    },
  });
});

export const getApplication = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const application = await applicationModel.find({ _id: id });
  if (!application) {
    return next(new AppError('No Application found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      application,
    },
  });
});

export const deleteApplication = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const application = await applicationModel.deleteOne({ _id: id });

  if (!application) {
    return next(new AppError('No Application found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createApplication = catchAsync(async (req, res, next) => {

  if (req.file) {
    req.body.resume = await fileUpload(req);;
  }
  let application = await applicationModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      application
    },
  });
});