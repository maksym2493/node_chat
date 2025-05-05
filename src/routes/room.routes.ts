import { Router } from 'express';
import { memberRoute } from './member.route';
import { messageRoute } from './message.route';
import { roomController } from '../controllers/room.controller';

import { nameSchema } from '../schemas/name.schema';
import { roomIdSchema } from '../schemas/roomId.schema';
import { validationMiddleware } from '../middlewares/validation.middleware';

export const roomRoute = Router();

roomRoute.get('/', roomController.getAll);

roomRoute.get(
  '/:roomId',
  validationMiddleware(roomIdSchema, 'params'),
  roomController.getWithRole,
);

roomRoute.post('/', validationMiddleware(nameSchema), roomController.create);

roomRoute.use(
  '/:roomId/members',
  validationMiddleware(roomIdSchema, 'params'),
  memberRoute,
);

roomRoute.use(
  '/:roomId/messages',
  validationMiddleware(roomIdSchema, 'params'),
  messageRoute,
);
