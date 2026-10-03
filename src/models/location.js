import { model, Schema } from 'mongoose';

const coordinatesSchema = new Schema(
  {
    lat: Number,
    lon: Number,
  },
  { _id: false },
);

const locationSchema = new Schema(
  {
    image: String,
    name: String,
    locationType: String,
    region: String,
    rate: Number,
    description: String,
    advantages: [String],
    coordinates: coordinatesSchema,
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    feedbacksId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Feedback',
      },
    ],
    feedbacksCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { versionKey: false, timestamps: true },
);

export const Location = model('Location', locationSchema);
