import { Router } from 'express';
import cookieParser from 'cookie-parser';
import { authController } from '../controllers/auth.controller';

import { nameValidation } from '../validations/name.validation';
import { tokenValidation } from '../validations/token.validation';
import { validationMiddleware } from '../middlewares/validation.middleware';

export const authRoute = Router();

authRoute.post(
  '/registration',
  nameValidation(),
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
