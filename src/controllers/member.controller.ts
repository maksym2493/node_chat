import { RequestHandler } from 'express';
import { memberService } from '../services/member.service';

const join: RequestHandler = async (req, res) => {
  const { roomId } = req.params;
  const { id: userId } = req.user!;
  const normalizedRoom = await memberService.join(roomId, userId);

  res.status(201).json({
    message: 'OK',
    data: normalizedRoom,
  });
};

export const memberController = { join };
