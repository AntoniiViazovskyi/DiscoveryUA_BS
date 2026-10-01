import { Joi, Segments } from 'celebrate';

import { emailRegex } from '../constants/emailRegexp.js';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .pattern(emailRegex)
      .max(64)
      .required(),
    password: Joi.string().min(8).max(128).required(),
    username: Joi.string().trim().min(3).max(32).required(),
  }).unknown(false),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .pattern(emailRegex)
      .max(64)
      .required(),
    password: Joi.string().min(8).max(128).required(),
  }).unknown(false),
};
