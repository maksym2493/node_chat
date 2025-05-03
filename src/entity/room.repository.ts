import { db } from '../utils/db';
import { Member, Message, Room } from '@prisma/client';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';

type RawRoomInfo = Room & { messages: Message[]; members: Member[] };

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
          orderBy: { createdAt: 'desc' },
          take: 1,
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

  getByName(name: string): Promise<Room | null> {
    return db.room.findUnique({ where: { name } });
  }
}

export const roomRepository = new RoomRepository();
