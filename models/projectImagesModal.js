import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProjectImagesSchema = new Schema({
  image: {
    type: String,
    required: [true, 'Image required']
  },
  project: {
    type: Schema.ObjectId,
    ref: 'Project'
  }
});

const ProjectImages = model('ProjectImages', ProjectImagesSchema);

export default ProjectImages;
