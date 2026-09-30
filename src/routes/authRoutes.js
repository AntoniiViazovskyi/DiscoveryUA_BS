import { celebrate } from 'celebrate';
import { Router } from 'express';

import { loginUser, registerUser } from '../controllers/authController.js';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';

const authRoutes = Router();

authRoutes.post(
  '/auth/register',
  celebrate(registerUserSchema, { abortEarly: false }),
  registerUser,
);

authRoutes.post(
  '/auth/login',
  celebrate(loginUserSchema, { abortEarly: false }),
  loginUser,
);

export default authRoutes;
