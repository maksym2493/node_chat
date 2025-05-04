import { Router } from 'express';
import { messageController } from '../controllers/message.controller';
import { textValidation } from '../validations/text.validation';
import { validationMiddleware } from '../middlewares/validation.middleware';

export const messageRoute = Router({ mergeParams: true });

messageRoute.get('/', messageController.getAll);

messageRoute.post(
  '/',
  textValidation,
  validationMiddleware,
  messageController.create,
);
