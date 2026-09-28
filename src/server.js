import 'dotenv/config';

import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import authRoutes from './routes/authRoutes.js';
import userLocationsRoutes from './routes/userLocationsRoutes.js';
import userRouter from './routes/userRouter.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import locationsRoutes from './routes/locationsRoutes.js';

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(
  express.json({
    type: ['application/json', 'application/vnd.api+json'],
    limit: '100kb',
  }),
);

app.use(logger);
app.use(cors());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/users', userLocationsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/locations', locationsRoutes);
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

export const startServer = async () => {
  await connectMongoDB();

  return app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  await startServer();
}

export { app };
