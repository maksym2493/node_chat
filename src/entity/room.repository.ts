import { db } from '../utils/db';
import { Member, Room } from '@prisma/client';
import { RawMessage } from '../types/RawMessage';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';

type RawRoomInfo = Room & { messages: RawMessage[]; members: Member[] };

class RoomRepository {
  getAll(userId: string): Promise<RawRoomInfo[]> {
    return db.room.findMany({
      where: {
        members: {
          some: { userId },
        },
      },

      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },

          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        },

        members: {
          where: { userId },
        },
      },
    });
  }

  create(name: string, tx?: PrismaTransactionClient): Promise<Room> {
    return (tx || db).room.create({
      data: { name },
    });
  }

  get(id: string): Promise<Room | null> {
    return db.room.findUnique({ where: { id } });
  }
}

export const roomRepository = new RoomRepository();
