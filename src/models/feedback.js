import { model, Schema } from 'mongoose';

const feedbackSchema = new Schema(
  {
    rate: Number,
    description: String,
    userName: String,
    isApproved: { type: Boolean, default: false },
  },
  { versionKey: false },
);

export const Feedback = model('Feedback', feedbackSchema);
