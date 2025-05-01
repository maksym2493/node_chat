import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

import { userValidation } from '../validators/user.validator';
import { validationMiddleware } from '../middlewares/validation.middleware';

export const authRoute = Router();

authRoute.post(
  '/register',
  userValidation.register,
  validationMiddleware,
  authController.register,
);

authRoute.get('/refresh-token', authController.refreshToken);
