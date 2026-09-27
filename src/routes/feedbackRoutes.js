import { celebrate } from 'celebrate';
import { Router } from 'express';

import { addFeedback } from '../controllers/feedbackController.js';
import { authenticate } from '../middleware/authenticate.js';
import { createFeedbackSchema } from '../validations/feedbackValidation.js';

const feedbackRoutes = Router();

feedbackRoutes.post(
  '/',
  authenticate,
  celebrate(createFeedbackSchema),
  addFeedback,
);

export default feedbackRoutes;
