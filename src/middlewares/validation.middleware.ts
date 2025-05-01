import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import { ApiError } from '../exceptions/api.error';

export const validationMiddleware: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  const formattedErrors = errors.array().reduce(
    (acc, error) => {
      if (error.type === 'field') {
        if (!acc[error.path]) {
          acc[error.path] = error.msg;
        }
      }

      return acc;
    },
    {} as Record<string, string>,
  );

  if (!errors.isEmpty()) {
    throw ApiError.badRequest('Validation error', formattedErrors);
  }

  next();
};
