import { db } from '../utils/db';
import { RawMessage } from '../types/RawMessage';

class MessageRepository {
  getAll(roomId: string): Promise<RawMessage[]> {
    return db.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },

      include: {
        author: {
          select: {
            name: true,
          },
        },
      },

      take: 100,
    });
  }

  create(roomId: string, authorId: string, text: string): Promise<RawMessage> {
    return db.message.create({
      data: { roomId, authorId, text },

      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}

export const messageRepository = new MessageRepository();
