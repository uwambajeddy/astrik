import sharp from 'sharp';
import multer from 'multer';
import mongoose from 'mongoose';
import catchAsync from '../util/catchAsync.js';
import AppError from '../util/AppError.js';
import blogModel from '../models/blogModel.js';
import commentModel from '../models/commentModal.js';
import Email from '../util/email.js';
import userModel from '../models/userModel.js';

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
  fileFilter: multerFilter,
});

export const uploadBlogImage = upload.single('image');

export const resizeBlogPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.originalname = `blog-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(630, 350)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/blog/${req.file.originalname}`);

  next();
});

export const getBlogs = catchAsync(async (req, res, next) => {
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
          {
            $unwind: '$user',
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unset: ['user.password', 'user.role', 'user.active', 'user.email'],
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

export const getBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
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
          {
            $unwind: '$user',
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unset: ['user.password', 'user.role', 'user.active', 'user.email'],
          },
        ],
      },
    },
  ]);
  if (!blog) {
    return next(new AppError('No Blog found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

export const deleteBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const blog = await blogModel.deleteOne({ _id: id });

  if (!blog) {
    return next(new AppError('No Blog found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createBlog = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.originalname;

  const blog = await blogModel.create(req.body);
  const users = await userModel.find({ subscription: true });
  const url = `${req.protocol}://${req.get('host')}/blog/${blog._id}`;
  const rootDir = `${req.protocol}://${req.get('host')}`;
  const message = {
    image: blog.image,
    title: blog.title,
    body: blog.body,
  };
  users.map(async (user) => {
    try {
      await new Email(user, url, message, rootDir).sendNewPost();
    } catch (err) {
      console.log(err);
    }
  });

  res.status(201).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

export const updateBlog = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.originalname;

  const blog = await blogModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    return next(new AppError('No Blog found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: blog,
    },
  });
});

export const handleLike = catchAsync(async (req, res, next) => {
  const blog = await blogModel.findById(req.params.id);
  if (!blog) {
    return next(new AppError('No Blog found with that ID', 404));
  }
  if (!blog.likedBy.includes(req.user.id)) {
    blog.likedBy.push(req.user.id);
    blog.save();
  } else {
    blog.likedBy.pull(req.user.id);
    blog.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

export const getAllComments = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const comments = await commentModel.find({ blog: id });
  if (!comments) {
    return next(new AppError('No Comments found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      comments,
    },
  });
});

export const deleteComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await commentModel.deleteOne({ _id: id });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const approveComment = catchAsync(async (req, res, next) => {
  const comment = await commentModel.findById(req.params.id);
  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  if (!comment.approve) {
    comment.approve = true;
    comment.save();
  } else {
    comment.approve = false;
    comment.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

export const createComment = catchAsync(async (req, res, next) => {
  const blog = await blogModel.findById(req.params.id);
  if (!blog) {
    return next(new AppError('No Blog found with that ID', 404));
  }
  const comment = await commentModel.create({
    comment: req.body.comment,
    user: req.user._id,
    blog: req.params.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});
