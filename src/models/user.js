import { model, Schema } from 'mongoose';

import { emailRegex } from '../constants/emailRegexp.js';

const userSchema = new Schema(
  {
    name: String,
    avatarUrl: String,
    articlesAmount: Number,
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      minLength: 3,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      match: emailRegex,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      minLength: 8,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = model('User', userSchema);
