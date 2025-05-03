import cors from 'cors';
import express, { Express } from 'express';

import { authRoute } from './routes/auth.routes';
import { roomRoute } from './routes/room.routes';

import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';

import { tokenValidation } from './validations/token.validation';
import { validationMiddleware } from './middlewares/validation.middleware';

const CLIENT_URL = process.env.CLIENT_URL;

export function createApp(): Express {
  const app = express();

  app.use(
    cors({
      methods: 'POST',
      credentials: true,
      origin: CLIENT_URL,
    }),
  );

  app.use(express.json());

  app.use('/api/auth', authRoute);

  app.use(
    '/api/rooms',
    tokenValidation.accessToken,
    validationMiddleware,
    authMiddleware,
    roomRoute,
  );

  app.use(errorMiddleware);

  return app;
}
