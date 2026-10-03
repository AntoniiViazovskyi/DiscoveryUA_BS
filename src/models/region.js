import { model, Schema } from 'mongoose';

const regionSchema = new Schema(
  {
    region: { type: String },
    slug: { type: String },
    level: { type: String },
    note: { type: String },
  },
  { versionKey: false, timestamps: true },
);

export const Region = model('Region', regionSchema);
