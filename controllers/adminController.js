import catchAsync from '../util/catchAsync.js';
import projectModel from '../models/projectModel.js';
import blogModel from '../models/blogModel.js';
import userModel from '../models/userModel.js';
import commentModel from '../models/commentModal.js';
import messageModel from '../models/messageModal.js';
import careerModal from '../models/careerModel.js';
import mongoose from 'mongoose';
import ProjectImages from '../models/projectImagesModal.js';
import BlogImages from '../models/blogImagesModal.js';
import Training from '../models/trainingModal.js';
import Application from '../models/applicationModal.js';

export const adminPage = catchAsync(async (req, res, next) => {
    const projects = await projectModel.find();
    const users = await userModel.find();
    const subscribers = await userModel.find({ subscription: true });
    const messages = await messageModel.find();
    const blogs = await blogModel.aggregate([
        {
            $lookup: {
                from: 'comments',
                as: 'comments',
                let: { blog: '$_id' },
                pipeline: [
                    {
                        $match: { $expr: { $eq: ['$blog', '$$blog'] } },
                    },
                ],
            },
        },
    ]);
    const comments = await commentModel.find();

    res.status(200).render('admin/index', {
        projects, users, messages, blogs, comments, subscribers
    });
});

export const adminMessagesPage = catchAsync(async (req, res, next) => {
    const messages = await messageModel.find();
    res.status(200).render('admin/messages', {
        messages
    });
});
export const adminCareerPage = catchAsync(async (req, res, next) => {
    const jobs = await careerModal.find();
    res.status(200).render('admin/jobs', {
        jobs
    });
});
export const adminTrainingsPage = catchAsync(async (req, res, next) => {
    const applications = await Training.find();
    res.status(200).render('admin/trainings', {
        applications
    });
});
export const adminProjectsPage = catchAsync(async (req, res, next) => {
    const projects = await projectModel.find();
    const projectImages = await ProjectImages.find();
    res.status(200).render('admin/projects', {
        projects,
        projectImages
    });
});

export const adminProfilePage = catchAsync(async (req, res, next) => {
    res.status(200).render('admin/profile');
});

export const adminSubscribersPage = catchAsync(async (req, res, next) => {
    const subscribers = await userModel.find({ subscription: true });
    res.status(200).render('admin/subscribers',
        { subscribers }
    );
});

export const adminBlogsPage = catchAsync(async (req, res, next) => {
    const blogs = await blogModel.aggregate([
        {
            $lookup: {
                from: 'comments',
                as: 'comments',
                let: { blog: '$_id' },
                pipeline: [
                    {
                        $match: { $expr: { $eq: ['$blog', '$$blog'] } },
                    },
                ],
            },
        },
    ]);
    const blogImages = await BlogImages.find();
    res.status(200).render('admin/blogs', {
        blogs,
        blogImages
    });
});

export const adminCommentsPage = catchAsync(async (req, res, next) => {
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
                        },
                    }
                ],
            },
        },
    ]);
    if (!blog) {
        return next(new AppError('No Blog found with that ID', 404));
    }

    res.status(200).render('admin/comments', {
        blog: blog[0]
    });
});

export const adminUsersPage = catchAsync(async (req, res, next) => {
    const users = await userModel.find().select('+active');

    res.status(200).render('admin/users', {
        users,
    });
});
export const adminJobApplicantsPage = catchAsync(async (req, res, next) => {
    const applications = await Application.find();

    res.status(200).render('admin/applicants', {
        applications,
    });
});
export const adminProjectImagesPage = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const images = await ProjectImages.find({ project: id });

    if (!images) {
        return next(new AppError('No Images found with that ID', 404));
    }

    res.status(200).render('admin/project_images', {
        images,
    });
});
export const adminBlogImagesPage = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const images = await BlogImages.find({ blog: id });

    if (!images) {
        return next(new AppError('No Images found with that ID', 404));
    }

    res.status(200).render('admin/blog_images', {
        images,
    });
});

