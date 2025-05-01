import { check } from 'express-validator';

const name = [
  check('name')
    .trim()

    .notEmpty()
    .withMessage('Name is required')

    .isLength({ min: 6 })
    .withMessage('Name must be at least 6 characters long')

    .isLength({ max: 50 })
    .withMessage('Name must be at most 50 characters long'),
];

const register = [...name];

export const userValidation = {
  name,
  register,
};
