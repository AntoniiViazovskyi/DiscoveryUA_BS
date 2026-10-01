import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  getSession,
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';

const authRoutes = Router();

authRoutes.post(
  '/register',
  celebrate(registerUserSchema, { abortEarly: false }),
  registerUser,
);

authRoutes.post(
  '/login',
  celebrate(loginUserSchema, { abortEarly: false }),
  loginUser,
);

authRoutes.post('/logout', authenticate, logoutUser);
authRoutes.post('/refresh', refreshUserSession);
authRoutes.get('/session', authenticate, getSession);

export default authRoutes;
