import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const CommentSchema = new Schema({
  comment: {
    type: String,
    unique:false,
    required: [true, 'Comment section can not be empty! ']
  },
  date: {
    type: Date,
    default: Date.now()
  },
  blog: {
    type: Schema.ObjectId,
    ref: 'Blog'
  },
  author: {
    type: String,
    required: [true, 'Please! tell us your name.']
  },
  email: {
    type: String,
    required: [true, 'Please! provide your email.'],
    lowercase: true,
    unique:false
  },
  approve: {
    type: Boolean,
    default: false
  }
});

const Comment = model('Comment', CommentSchema);

export default Comment;
