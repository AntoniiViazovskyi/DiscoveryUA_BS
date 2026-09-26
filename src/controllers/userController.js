import { getUserById, getPublicUserById } from '../services/userService.js';
import { isValidObjectId } from 'mongoose';

export const getUserProfile = async (req, res) => {
  const userId = req.user._id;
  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({ status: 404, message: 'User not found' });
  }

  res.status(200).json({ status: 200, data: user });
};

export const getPublicUserProfile = async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ status: 400, message: 'Invalid user ID' });
  }

  const user = await getPublicUserById(userId);

  if (!user) {
    return res.status(404).json({ status: 404, message: 'User not found' });
  }

  res.status(200).json({ status: 200, data: user });
};
