import createHttpError from 'http-errors';
import mongoose from 'mongoose';

import { Feedback } from '../models/feedback.js';
import { Location } from '../models/location.js';

export const createLocationFeedback = async (feedbackData) =>
  mongoose.connection.transaction(async (session) => {
    const location = await Location.findById(feedbackData.locationId).session(
      session,
    );

    if (!location) {
      throw createHttpError(404, 'Location not found');
    }

    const feedback = new Feedback({
      rate: feedbackData.rate,
      description: feedbackData.description,
      userName: feedbackData.userName,
      isApproved: true,
    });

    await feedback.save({ session });
    location.feedbacksId.push(feedback._id);

    const [feedbackStats] = await Feedback.aggregate([
      { $match: { _id: { $in: location.feedbacksId } } },
      {
        $group: {
          _id: null,
          averageRate: { $avg: '$rate' },
          feedbacksCount: { $sum: 1 },
        },
      },
    ]).session(session);

    location.feedbacksCount = feedbackStats?.feedbacksCount ?? 0;
    location.rate = feedbackStats?.averageRate ?? 0;
    await location.save({ session });

    return {
      feedback,
      location: {
        _id: location._id,
        rate: location.rate,
        feedbacksCount: location.feedbacksCount,
      },
    };
  });
