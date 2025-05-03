import { cookie, header } from 'express-validator';

const refreshToken = cookie('refreshToken')
  .exists()
  .withMessage('Refresh token is required')

  .isJWT()
  .withMessage('Invalid refresh token');

const accessToken = header('authorization')
  .exists()
  .withMessage('Access token is required')

  .matches(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/)
  .withMessage('Invalid access token');

export const tokenValidation = { refreshToken, accessToken };
