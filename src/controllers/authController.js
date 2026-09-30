import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';

export const registerUser = async (req, res) => {
  const { email, password, username } = req.body;
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email: normalizedEmail,
    password: hashedPassword,
    username,
  });

  const session = await createSession(newUser._id);
  setSessionCookies(res, session);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Invalid email or password');
  }
  await Session.deleteMany({ userId: user._id });
  const session = await createSession(user._id);

  setSessionCookies(res, session);

  res.status(200).json(user);
};
