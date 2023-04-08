import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Project should have a name']
    },
    type: {
      type: String,
      required: [true, 'Project should have a type']
    },
    description: {
      type: String,
      required: [true, 'Project should have a description']
    },
    date: {
      type: Date,
      required: [true, 'Project should have a date']
    },
  }
);

const Project = model('Project', ProjectSchema);

export default Project;
