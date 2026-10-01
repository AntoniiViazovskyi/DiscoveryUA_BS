import createHttpError from 'http-errors';

import { Location } from '../models/location.js';
import {
  getUserById,
  getPublicUserById,
  updateUser,
} from '../services/userService.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await getUserById(userId);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    res.status(200).json({ status: 200, data: user });
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await getPublicUserById(userId);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json({ status: 200, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };

    delete updateData.articlesAmount;

    const updatedUser = await updateUser(userId, updateData);

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(createHttpError(409, 'Email in use'));
    }
    next(error);
  }
};

export const getUserLocations = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;

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
