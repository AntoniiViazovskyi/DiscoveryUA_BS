import { Router } from 'express';
import {
  getUserProfile,
  getUserByIdController,
  updateUserProfile,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateBody } from '../middleware/validateBody.js';
import { updateUserSchema } from '../validations/userValidation.js';

const userRouter = Router();

userRouter.get('/me', authenticate, getUserProfile);
userRouter.patch(
  '/me',
  authenticate,
  validateBody(updateUserSchema),
  updateUserProfile,
);

userRouter.get('/:userId', getUserByIdController);

export default userRouter;
