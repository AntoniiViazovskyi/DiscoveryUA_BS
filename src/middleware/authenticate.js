import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    const accessToken = req.cookies?.accessToken || bearerToken;
    const sessionId = req.cookies?.sessionId;

    if (!accessToken || !sessionId) {
      throw createHttpError(401, 'Not authorized');
    }

    const session = await Session.findOne({ _id: sessionId, accessToken });

    if (!session) {
      throw createHttpError(401, 'Session not found or invalid');
    }
    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);

    if (isAccessTokenExpired) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(session.userId);

    if (!user) {
      throw createHttpError(401, 'User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
