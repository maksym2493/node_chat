import cors from 'cors';
import express, { Express } from 'express';

import { authRoute } from './routes/auth.routes';
import { errorMiddleware } from './middlewares/error.middleware ';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/auth', authRoute);

  app.use(errorMiddleware);

  return app;
}
