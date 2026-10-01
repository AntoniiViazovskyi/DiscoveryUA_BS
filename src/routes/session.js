// src/routes/session.js
import { Router } from 'express';
import {
  logoutController,
  refreshSessionController,
} from '../controllers/session.js';

const sessionRoutes = Router();

sessionRoutes.post('/auth/logout', logoutController);
sessionRoutes.post('/auth/refresh', refreshSessionController);

export default sessionRoutes;
