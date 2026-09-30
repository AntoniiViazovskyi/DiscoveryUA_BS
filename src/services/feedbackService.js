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
      isApproved: false,
    });

    await feedback.save({ session });
    location.feedbacksId.push(feedback._id);
    await location.save({ session });

    return feedback;
  });
