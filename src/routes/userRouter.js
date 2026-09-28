import { Router } from 'express';
import {
  getUserProfile,
<<<<<<< HEAD
  updateUserProfile,
=======
  getPublicUserProfile,
>>>>>>> origin/main
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';

const userRouter = Router();

userRouter.get('/me', authenticate, getUserProfile);
userRouter.patch('/me', authenticate, updateUserProfile);

userRouter.get('/:userId', getPublicUserProfile);

export default userRouter;
