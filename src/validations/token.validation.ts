import { cookie } from 'express-validator';

const refreshToken = cookie('refreshToken')
  .exists()
  .withMessage('Token is required')

  .isJWT()
  .withMessage('Invalid token');

export const tokenValidation = { refreshToken };
