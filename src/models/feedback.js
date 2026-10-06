import { model, Schema } from 'mongoose';

const feedbackSchema = new Schema(
  {
    rate: Number,
    description: String,
    userName: String,
    isApproved: { type: Boolean, default: true },
  },
  { versionKey: false, timestamps: true },
);

export const Feedback = model('Feedback', feedbackSchema);
