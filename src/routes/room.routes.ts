import { Router } from 'express';
import { roomController } from '../controllers/room.controller';

import { nameValidation } from '../validations/name.validation';
import { validationMiddleware } from '../middlewares/validation.middleware';

export const roomRoute = Router();

roomRoute.get('/', roomController.getAll);

roomRoute.post(
  '/',
  nameValidation(),
  validationMiddleware,
  roomController.create,
);

roomRoute.post(
  '/join',
  nameValidation(),
  validationMiddleware,
  roomController.join,
);
