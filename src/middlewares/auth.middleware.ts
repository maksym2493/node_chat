import { RequestHandler } from 'express';

import { jwt } from '../utils/jwt';
import { ApiError } from '../exceptions/api.error';

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const [, token] = req.headers['authorization']!.split(' ');
  const normalizedUser = jwt.validateAccessToken(token);

  if (!normalizedUser) {
    throw ApiError.unauthorized('Invalid access token');
  }

  req.user = normalizedUser;

  next();
};
