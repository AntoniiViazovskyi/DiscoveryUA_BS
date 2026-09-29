import Joi from 'joi';
import { emailRegex } from '../constants/emailRegexp';

export const updateUserSchema = Joi.objeck({
  username: Joi.string().min(3),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
  avatarUrl: Joi.string(),
});
