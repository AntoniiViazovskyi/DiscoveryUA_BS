import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  addFeedback,
  getLocationFeedbacks,
} from '../controllers/feedbackController.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  createFeedbackSchema,
  getFeedbacksSchema,
} from '../validations/feedbackValidation.js';

const feedbackRoutes = Router();

feedbackRoutes.get('/', celebrate(getFeedbacksSchema), getLocationFeedbacks);

feedbackRoutes.post(
  '/',
  authenticate,
  celebrate(createFeedbackSchema),
  addFeedback,
);

export default feedbackRoutes;
