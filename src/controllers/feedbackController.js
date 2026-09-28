import createHttpError from 'http-errors';

import { Location } from '../models/location.js';
// registers the Feedback schema so Location.populate('feedbacksId') can resolve it
import '../models/feedback.js';

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

  const locationQuery = Location.findById(locationId);
  const location = await locationQuery.populate('feedbacksId');

  if (!location) {
    throw createHttpError(404, 'Location not found');
  }

  const feedbacks = Array.isArray(location.feedbacksId) ? location.feedbacksId : [];
  const visibleFeedbacks = feedbacks.filter((item) => item?.isApproved === true);
  const total = visibleFeedbacks.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedFeedbacks = visibleFeedbacks.slice((page - 1) * limit, page * limit);

  res.status(200).json({
    data: paginatedFeedbacks,
    page,
    limit,
    total,
    totalPages,
  });
};
