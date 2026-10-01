import createHttpError from 'http-errors';

import { Location } from '../models/location.js';
// Registers the Feedback schema so Location.populate('feedbacksId') can resolve it.
import '../models/feedback.js';

import { createLocationFeedback } from '../services/feedbackService.js';

export const getLocationFeedbacks = async (req, res) => {
  const { locationId } = req.query;
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);

  if (!locationId) {
    throw createHttpError(400, 'locationId is required');
  }

  if (!Number.isInteger(page) || page < 1) {
    throw createHttpError(400, 'page must be a positive integer');
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw createHttpError(400, 'limit must be a positive integer');
  }

  const location = await Location.findById(locationId).populate('feedbacksId');

  if (!location) {
    throw createHttpError(404, 'Location not found');
  }

  const feedbacks = Array.isArray(location.feedbacksId)
    ? location.feedbacksId
    : [];

  const visibleFeedbacks = feedbacks.filter(
    (feedback) => feedback?.isApproved === true,
  );

  const total = visibleFeedbacks.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedFeedbacks = visibleFeedbacks.slice(
    (page - 1) * limit,
    page * limit,
  );

  res.status(200).json({
    data: paginatedFeedbacks,
    page,
    limit,
    total,
    totalPages,
  });
};

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