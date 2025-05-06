import { Request, RequestHandler, Response } from 'express';

import { db } from '../utils/db';
import { roomService } from '../services/room.service';
import { NormalizedRoom } from '../types/NormalizedRoom';
import { NormalizedUser } from '../types/NormalizedUser';
import { memberService } from '../services/member.service';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';

import { NameSchema } from '../schemas/name.schema';
import { RoomIdSchema } from '../schemas/roomId.schema';

import { RoomPreview } from '../types/RoomPreview';
import { ResponseBody } from '../types/ResponseBody';
import { RoomWithRole } from '../types/RoomWithRole';

class RoomController {
  getAll = async (req: Request, res: Response<ResponseBody<RoomPreview[]>>) => {
    const { id: userId } = req.user!;
    const preview = await roomService.getAll(userId);

    res.json({
      message: 'OK',
      data: preview,
    });
  };

  getWithRole = async (
    req: Request<RoomIdSchema>,
    res: Response<ResponseBody<RoomWithRole>>,
  ) => {
    const { id: userId } = req.user!;
    const { roomId: id } = req.params;

    const roomWithRole = await roomService.getWithRole(id, userId);

    res.json({
      message: 'OK',
      data: roomWithRole,
    });
  };

  create = async (
    req: Request<{}, {}, NameSchema>,
    res: Response<ResponseBody<RoomPreview>>,
  ) => {
    const { name } = req.body;
    const { id: userId } = req.user!;

    const preview = await db.$transaction(
      async (tx: PrismaTransactionClient): Promise<RoomPreview> => {
        const preview = await roomService.create(name, tx);
        await memberService.create(preview.id, userId, true, tx);

        return preview;
      },
    );

    res.status(201).json({
      message: 'OK',
      data: preview,
    });
  };
}

export const roomController = new RoomController();
