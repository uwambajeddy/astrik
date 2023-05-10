import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const careerSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Job should have a title']
    },
    body: {
      type: String,
      required: [true, 'Job should have a body']
    },
    location: {
      type: String,
      required: [true, 'Job should have a location']
    },
    jobNature: {
      type: String,
      required: [true, 'Job should have a job nature']
    },
    publishDate: {
      type: Date,
      default: Date.now()
    },
    deadLine: {
      type: Date,
      required: [true, 'Job should have a deadline']
    },
  }
);


const Career = model('Career', careerSchema);

export default Career;
