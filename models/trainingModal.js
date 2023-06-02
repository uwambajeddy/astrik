import mongoose from 'mongoose';
import validator from 'validator';

const { isEmail } = validator;

const { Schema, model } = mongoose;

const trainingSchema = new Schema({
  program: {
    type: String,
    required: [true, ' Please Provide your program!!']
  },
  firstName: {
    type: String,
    required: [true, ' Please Provide your first name!!']
  },
  lastName: {
    type: String,
    required: [true, ' Please Provide your last name!!']
  },
  companyName: {
    type: String,
    required: [true, ' Please Provide your company name!!']
  },
  companyAddress: {
    type: String,
    required: [true, ' Please Provide your company address!!']
  },
  number: {
    type: String,
    required: [true, ' Please Provide your phone number!!']
  },
  email: {
    type: String,
    required: [true, 'Please Provide your email!!'],
    validate: [isEmail, 'Please! provide valid email']
  },
  paymentDetails: {
    type: String,
    required: [true, ' Please Provide payment details!!']
  },
  invoiceIssue: {
    type: String,
    required: [true, ' Please Provide where to issue the invoice!!']
  },
  specificRequirement: {
    type: String,
    required: [true, ' Please Provide your Specific requirement!!']
  },
  date: {
    type: Date,
    default: Date.now()
  },
  module: [
    {
      type: String
    }
  ]
});

const Training = model('Training', trainingSchema);

export default Training;
