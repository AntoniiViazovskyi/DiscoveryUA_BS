import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import {
  createSessionData,
  setSessionCookies,
  clearSessionCookies,
} from '../utils/createSession.js';

// POST /auth/logout
export const logoutController = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }

    clearSessionCookies(res);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// POST /auth/refresh
export const refreshSessionController = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
      throw createHttpError(401, 'Not authorized');
    }

    const session = await Session.findOne({ _id: sessionId, refreshToken });

    if (!session) {
      throw createHttpError(401, 'Session not found or invalid');
    }

    const isRefreshTokenExpired =
      new Date() > new Date(session.refreshTokenValidUntil);

    if (isRefreshTokenExpired) {
      //  refresh token - видаляємо стару сесію,
      // клієнт має пройти логін заново.
      await Session.deleteOne({ _id: sessionId });
      clearSessionCookies(res);
      throw createHttpError(401, 'Session expired, please log in again');
    }

    // Ротація: видаляємо стару сесію і створюємо нову.
    await Session.deleteOne({ _id: sessionId });

    const newSession = await Session.create(createSessionData(session.userId));

    setSessionCookies(res, newSession);

    res.status(200).json({
      status: 200,
      message: 'Session refreshed successfully',
      data: {
        accessToken: newSession.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
