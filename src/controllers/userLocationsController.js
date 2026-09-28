import mongoose from 'mongoose';

import { Location } from '../models/location.js';

export const getUserLocations = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({ message: 'page must be >= 1' });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      return res
        .status(400)
        .json({ message: 'limit must be between 1 and 50' });
    }

    const skip = (page - 1) * limit;

    const [locations, total] = await Promise.all([
      Location.find({ ownerId: userId })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Location.countDocuments({ ownerId: userId }),
    ]);

    return res.status(200).json({
      data: locations,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
      userId,
    });
  } catch (error) {
    next(error);
  }
};
