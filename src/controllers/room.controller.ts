import { RequestHandler } from 'express';

import { db } from '../utils/db';
import { Member } from '@prisma/client';
import { roomService } from '../services/room.service';
import { NormalizedRoom } from '../types/NormalizedRoom';
import { memberService } from '../services/member.service';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';

const getAll: RequestHandler = async (req, res) => {
  const { id: userId } = req.user!;
  const rooms = await roomService.getAll(userId);

  res.json({
    rooms,
    message: 'OK',
  });
};

const create: RequestHandler = async (req, res) => {
  const { name } = req.body;
  const { id: userId } = req.user!;

  const normalizedFullRoom = await db.$transaction(
    async (tx: PrismaTransactionClient): Promise<NormalizedRoom> => {
      const normalizedFullRoom = await roomService.create(name, tx);

      const member = await memberService.create(
        normalizedFullRoom.id,
        userId,
        true,
        tx,
      );

      return normalizedFullRoom;
    },
  );

  res.json({
    message: 'OK',
    room: normalizedFullRoom,
  });
};

const join: RequestHandler = async (req, res) => {
  const { name } = req.body;
  const { id: userId } = req.user!;
  const normalizedRoom = await memberService.join(name, userId);

  res.json({
    room: {
      ...normalizedRoom,
      creator: false,
      lastMessage: null,
    },
    message: 'OK',
  });
};

export const roomController = { getAll, create, join };
