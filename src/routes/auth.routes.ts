import { Router } from 'express';
import cookieParser from 'cookie-parser';
import { authController } from '../controllers/auth.controller';

import { authValidation } from '../validations/auth.validation';
import { tokenValidation } from '../validations/token.validation';
import { validationMiddleware } from '../middlewares/validation.middleware';

export const authRoute = Router();

authRoute.post(
  '/register',
  authValidation.register,
  validationMiddleware,
  authController.register,
);

authRoute.get(
  '/refresh-token',
  cookieParser(),
  tokenValidation.refreshToken,
  validationMiddleware,
  authController.refreshToken,
);
