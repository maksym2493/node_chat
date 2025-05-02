import { check } from 'express-validator';

const name = check('name')
  .isString()
  .withMessage('Name must be string')

  .trim()

  .notEmpty()
  .withMessage('Name is required')

  .isLength({ min: 6, max: 50 })
  .withMessage('Name must be between 6 and 50 characters long');

export const userValidation = {
  name,
};
