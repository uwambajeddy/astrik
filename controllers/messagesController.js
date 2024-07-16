import catchAsync from '../util/catchAsync.js';
import AppError from '../util/AppError.js';
import messageModal from '../models/messageModal.js';

export const getMessages = catchAsync(async (req, res, next) => {
  const messages = await messageModal.find();
  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages
    }
  });
});

export const getMessage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await messageModal.findById(id);
  res.status(200).json({
    status: 'success',
    data: {
      message
    }
  });
});

export const deleteMessage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await messageModal.deleteOne({ _id: id });

  if (!message) {
    return next(new AppError('No message found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const createMessage = catchAsync(async (req, res, next) => {
  const message = await messageModal.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      message
    }
  });
});
