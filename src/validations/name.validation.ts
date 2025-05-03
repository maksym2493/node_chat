import { body, param } from 'express-validator';
import { ValidationChain } from 'express-validator';

const buildNameValidation = (
  fromParams: boolean = false,
): ValidationChain[] => {
  const source = fromParams ? param : body;

  return [
    source('name')
      .isString()
      .withMessage('Name must be string')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 6, max: 50 })
      .withMessage('Name must be between 6 and 50 characters long'),
  ];
};

export const nameValidation = buildNameValidation;
