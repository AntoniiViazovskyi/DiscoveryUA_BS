import Joi from 'joi';
import { emailRegex } from '../constants/emailRegexp.js';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(32),
  username: Joi.string().min(3).max(32).trim(),
  email: Joi.string().pattern(emailRegex).trim().lowercase(),
  password: Joi.string().min(8),
  articlesAmount: Joi.number().integer().min(0),
  avatarUrl: Joi.string().uri(),
}).min(1);
