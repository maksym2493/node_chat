import { param } from 'express-validator';

export const roomIdValidation = param('roomId')
  .isUUID()
  .withMessage('Invalid roomId');
