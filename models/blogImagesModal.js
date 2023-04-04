import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const BlogImagesSchema = new Schema({
  image: {
    type: String,
    required: [true, 'Image required']
  },
  blog: {
    type: Schema.ObjectId,
    ref: 'Blog'
  }
});

const BlogImages = model('BlogImages', BlogImagesSchema);

export default BlogImages;
