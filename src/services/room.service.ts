import { Message, Room } from '@prisma/client';
import { ApiError } from '../exceptions/api.error';
import { NormalizedRoom } from '../types/NormalizedRoom';
import { roomRepository } from '../entity/room.repository';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';

class RoomService {
  normalize(
    { id, name }: Room,
    creator: boolean = false,
    lastMessage: Message | null = null,
  ): NormalizedRoom {
    return { id, name, creator, lastMessage };
  }

  async getAll(userId: string): Promise<NormalizedRoom[]> {
    const rawRooms = await roomRepository.getAll(userId);

    return rawRooms.map(({ messages, members, ...room }) =>
      this.normalize(room, members[0].creator, messages[0] || null),
    );
  }

  async create(
    name: string,
    tx?: PrismaTransactionClient,
  ): Promise<NormalizedRoom> {
    try {
      const room = await roomRepository.create(name, tx);

      return this.normalize(room, true);
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as any).code === 'P2002'
      ) {
        throw ApiError.badRequest('Creation error', {
          name: 'Room already exists',
        });
      }

      throw err;
    }
  }

  async getByName(name: string): Promise<NormalizedRoom | null> {
    const room = await roomRepository.getByName(name);

    return room ? this.normalize(room) : null;
  }
}

export const roomService = new RoomService();
