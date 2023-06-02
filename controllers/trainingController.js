import catchAsync from '../util/catchAsync.js';
import AppError from '../util/AppError.js';
import trainingModel from '../models/trainingModal.js';

export const getTrainings = catchAsync(async (req, res, next) => {
  const trainings = await trainingModel.find();

  res.status(200).json({
    status: 'success',
    results: trainings.length,
    data: {
      trainings
    }
  });
});

export const getTraining = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const training = await trainingModel.findById(id);
  if (!training) {
    return next(new AppError('No Training application found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      training
    }
  });
});

export const deleteTraining = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const training = await trainingModel.deleteOne({ _id: id });

  if (!training) {
    return next(new AppError('No Training application found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const createTraining = catchAsync(async (req, res, next) => {
  let training = await trainingModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      training
    }
  });
});
