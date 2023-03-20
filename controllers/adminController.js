import catchAsync from '../util/catchAsync.js';
import projectModel from '../models/projectModel.js';
import blogModel from '../models/blogModel.js';
import userModel from '../models/userModel.js';
import commentModel from '../models/commentModal.js';
import messageModel from '../models/messageModal.js';
import mongoose from 'mongoose';

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
export const adminProjectsPage = catchAsync(async (req, res, next) => {
    const projects = await projectModel.find();
    res.status(200).render('admin/projects', {
        projects
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
                        $match: { $expr: { $eq: ['$blog', '$$blog'] }, approve: true },
                    },
                ],
            },
        },
    ]);

    res.status(200).render('admin/blogs', {
        blogs,
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
                        $unset: ['user.password', 'user.role', 'user.active'],
                    },
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
    const users = await userModel.find().select('+active');;

    res.status(200).render('admin/users', {
        users,
    });
});

