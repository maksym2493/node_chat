import { body } from 'express-validator';

export const textValidation = body('text')
  .notEmpty()
  .withMessage('Message is required')

  .isString()
  .withMessage('Message must be string')

  .trim()
  .isLength({ min: 6, max: 100 })
  .withMessage('Message must be between 6 and 100 characters');
