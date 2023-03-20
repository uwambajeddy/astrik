import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'project should have a title']
    },
    link: {
      type: String,
      required: [true, 'project should have a link']
    },
    image: String
  }
);

const project = model('project', projectSchema);

export default project;
