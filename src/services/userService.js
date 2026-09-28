import { User } from '../models/user.js';

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  return user;
};

export const getPublicUserById = async (userId) => {
  const user = await User.findById(userId).select(
    'name username avatarUrl articlesAmount',
  );
  return user;
};
