import { Joi, Segments } from 'celebrate';

import { emailRegex } from '../constants/emailRegexp.js';

const userId = Joi.string().hex().length(24).required();

export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(32),
    username: Joi.string().min(3).max(32).trim(),
    email: Joi.string().pattern(emailRegex).trim().lowercase().max(64),
    password: Joi.string().min(8).max(128),
    avatarUrl: Joi.string().uri(),
  })
    .min(1)
    .unknown(false),
};

export const getUserByIdSchema = {
  [Segments.PARAMS]: Joi.object({ userId }),
};

export const getUserLocationsSchema = {
  [Segments.PARAMS]: Joi.object({ userId }),
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
  }).unknown(false),
};
