import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  getUserByIdController,
  getUserLocations,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  getUserByIdSchema,
  getUserLocationsSchema,
  updateUserSchema,
} from '../validations/userValidation.js';

const userRoutes = Router();

userRoutes.get('/me', authenticate, getUserProfile);
userRoutes.patch(
  '/me',
  authenticate,
  celebrate(updateUserSchema, { abortEarly: false }),
  updateUserProfile,
);
userRoutes.get(
  '/:userId/locations',
  celebrate(getUserLocationsSchema),
  getUserLocations,
);
userRoutes.get(
  '/:userId',
  celebrate(getUserByIdSchema),
  getUserByIdController,
);

export default userRoutes;
