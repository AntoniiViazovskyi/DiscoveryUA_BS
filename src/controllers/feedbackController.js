import createHttpError from 'http-errors';

import { Location } from '../models/location.js';
import { Feedback } from '../models/feedback.js';

import { createLocationFeedback } from '../services/feedbackService.js';

export const getLatestApprovedFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.aggregate([
    { $match: { isApproved: true } },
    {
      $addFields: {
        sortDate: { $ifNull: ['$createdAt', { $toDate: '$_id' }] },
      },
    },
    { $sort: { sortDate: -1, _id: -1 } },
    { $limit: 7 },
    {
      $lookup: {
        from: Location.collection.name,
        localField: '_id',
        foreignField: 'feedbacksId',
        as: 'locations',
      },
    },
    { $unwind: { path: '$locations', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        rate: 1,
        description: 1,
        userName: 1,
        isApproved: 1,
        createdAt: { $ifNull: ['$createdAt', { $toDate: '$_id' }] },
        location: {
          _id: '$locations._id',
          name: '$locations.name',
        },
      },
    },
  ]);

  res.status(200).json({ data: feedbacks });
};

export const getLocationFeedbacks = async (req, res) => {
  const { locationId } = req.query;
  const { page, limit } = req.query;

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
