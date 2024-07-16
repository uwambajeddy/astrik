import decode from 'decode-html';
import mongoose from 'mongoose';
import catchAsync from '../util/catchAsync.js';
import AppError from '../util/AppError.js';
import blogModel from '../models/blogModel.js';
import commentModel from '../models/commentModal.js';
import { fileUpload } from '../util/multer.js';
import BlogImages from '../models/blogImagesModal.js';



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
          }
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
  req.body.body = decode(req.body.body);
  let blog = await blogModel.create(req.body);

  if (req.file) {
    req.body.image = await fileUpload(req);
    const blogImage = await BlogImages.create({ blog: blog._id, image: req.body.image });

    blog.image = blogImage;
  }
  res.status(201).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

export const updateBlog = catchAsync(async (req, res, next) => {
  if (req.body.body) req.body.body = decode(req.body.body);
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
  const blog = await blogModel.findById(req.body.blog);
  if (!blog) {
    return next(new AppError('No Blog found with that ID', 404));
  }
  const comment = await commentModel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

export const createBlogImage = catchAsync(async (req, res, next) => {

  if (!req.file) {
    return next(new AppError('Image required', 400));
  }
  req.body.image = await fileUpload(req);
  req.body.blog = req.params.id;
  const blogImage = await BlogImages.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      blogImage
    }
  });
});

export const updateBlogImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Image required', 400));
  }

  req.body.image = await fileUpload(req);

  const image = await BlogImages.findByIdAndUpdate(req.params.id, { image: req.body.image }, {
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

export const deleteBlogImage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const image = await BlogImages.deleteOne({ _id: id });
  if (!image) {
    return next(new AppError('No image found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
