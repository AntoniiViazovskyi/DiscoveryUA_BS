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
  },
  { versionKey: false },
);

export const Location = model('Location', locationSchema);
