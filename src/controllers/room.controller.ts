import { RequestHandler } from 'express';

import { db } from '../utils/db';
import { Member } from '@prisma/client';
import { roomService } from '../services/room.service';
import { NormalizedRoom } from '../types/NormalizedRoom';
import { memberService } from '../services/member.service';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';
import { ApiError } from '../exceptions/api.error';

const getAll: RequestHandler = async (req, res) => {
  const { id: userId } = req.user!;
  const preview = await roomService.getAll(userId);

  res.json({
    message: 'OK',
    data: preview,
  });
};

const getWithRole: RequestHandler = async (req, res) => {
  const { id: userId } = req.user!;
  const { roomId: id } = req.params;

  const roomWithRole = await roomService.getWithRole(id, userId);

  res.json({
    message: 'OK',
    data: roomWithRole,
  });
};

const create: RequestHandler = async (req, res) => {
  const { name } = req.body;
  const { id: userId } = req.user!;

  const preview = await db.$transaction(
    async (tx: PrismaTransactionClient): Promise<NormalizedRoom> => {
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

export const roomController = { getAll, getWithRole, create };
