import createHttpError from 'http-errors';

import { createLocationFeedback } from '../services/feedbackService.js';

export const addFeedback = async (req, res) => {
  const userName = req.user?.username?.trim();

  if (!userName || userName.length < 2 || userName.length > 32) {
    throw createHttpError(422, 'User has no valid username');
  }

  const feedback = await createLocationFeedback({
    ...req.body,
    userName,
  });

  res.status(201).json({ data: feedback });
};
