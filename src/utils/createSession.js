// src/utils/createSession.js
// Генерує нову пару токенів + дати валідності для сесії.
// Використовується і при логіні (якщо ще не використовується там),
// і при refresh.

import crypto from 'node:crypto';

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 хвилин
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 днів

export const createSessionData = (userId) => {
  return {
    userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL_MS),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  };
};

export const ACCESS_TOKEN_MAX_AGE = ACCESS_TOKEN_TTL_MS;
export const REFRESH_TOKEN_MAX_AGE = REFRESH_TOKEN_TTL_MS;

/**
 * Виставляє cookies accessToken, refreshToken та sessionId у response.
 * Викликати і при логіні, і при refresh, щоб не дублювати опції cookies.
 */
export const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    expires: session.accessTokenValidUntil,
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const clearSessionCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
};
