import { body } from 'express-validator';

export const nameValidation = body('name')
  .notEmpty()
  .withMessage('Name is required')

  .isString()
  .withMessage('Name must be string')

  .trim()
  .isLength({ min: 6, max: 50 })
  .withMessage('Name must be between 6 and 50 characters long');
