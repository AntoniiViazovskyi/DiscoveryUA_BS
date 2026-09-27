import { Router } from 'express';
import {
  getUserProfile,
  getPublicUserProfile,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';

const userRouter = Router();

userRouter.get('/me', authenticate, getUserProfile);

userRouter.get('/:userId', getPublicUserProfile);

export default userRouter;
