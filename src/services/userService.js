import bcrypt from 'bcrypt';
import { User } from '../models/user.js';

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  return user;
};

export const getPublicUserById = async (userId) => {
  return await User.findById(userId).select(
    'name username avatarUrl articlesAmount',
  );
};

export const updateUser = async (userId, updateData) => {
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  return await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');
};
