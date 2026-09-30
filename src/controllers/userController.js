import createHttpError from 'http-errors';
import { getUserById, updateUser } from '../services/userService.js';

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
    const user = await getUserById(userId);

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
    const updateData = req.body;

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
    next(error);
  }
};
