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
    client: {
      type: String,
      required: [true, 'Project should have a client']
    },
    location: {
      type: String,
      required: [true, 'Project should have a location']
    },
    role: {
      type: String,
      required: [true, 'Project should have a role']
    },
    description: {
      type: String,
      required: [true, 'Project should have a description']
    },
    date: {
      type: Date,
      required: [true, 'Project should have a starting date']
    },
    date_to: {
      type: Date,
      required: [true, 'Project should have an edning date']
    },
  }
);

const Project = model('Project', ProjectSchema);

export default Project;
