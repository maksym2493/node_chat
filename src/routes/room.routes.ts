import { Router } from 'express';
import { memberRoute } from './member.route';
import { messageRoute } from './message.route';
import { roomController } from '../controllers/room.controller';

import { nameValidation } from '../validations/name.validation';
import { roomIdValidation } from '../validations/roomId.validation';
import { validationMiddleware } from '../middlewares/validation.middleware';

export const roomRoute = Router();

roomRoute.get('/', roomController.getAll);

roomRoute.get(
  '/:roomId',
  roomIdValidation,
  validationMiddleware,
  roomController.getWithRole,
);

roomRoute.post(
  '/',
  nameValidation,
  validationMiddleware,
  roomController.create,
);

roomRoute.use(
  '/:roomId/members',
  roomIdValidation,
  validationMiddleware,
  memberRoute,
);

roomRoute.use(
  '/:roomId/messages',
  roomIdValidation,
  validationMiddleware,
  messageRoute,
);
