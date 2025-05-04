import { RequestHandler } from 'express';
import { messageService } from '../services/message.service';

const getAll: RequestHandler = async (req, res) => {
  const { roomId } = req.params;
  const { id: userId } = req.user!;
  const previews = await messageService.getAll(roomId, userId);

  res.json({ message: 'OK', data: previews });
};

const create: RequestHandler = async (req, res) => {
  const { text } = req.body;
  const { roomId } = req.params;
  const { id: authorId } = req.user!;

  const preview = await messageService.create(roomId, authorId, text);

  res.status(201).json({ message: 'OK', data: preview });
};

export const messageController = { getAll, create };
