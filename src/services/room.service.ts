import { Room } from '@prisma/client';
import { RawMessage } from '../types/RawMessage';
import { RoomPreview } from '../types/RoomPreview';
import { NormalizedRoom } from '../types/NormalizedRoom';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';

import { memberService } from './member.service';
import { messageService } from './message.service';
import { roomRepository } from '../entity/room.repository';

import { ApiError } from '../exceptions/api.error';

type RoomWithRole = Omit<RoomPreview, 'lastMessage'>;

class RoomService {
  normalize({ id, name }: Room): NormalizedRoom {
    return { id, name };
  }

  buildRoomPreview(
    room: Room,
    creator: boolean = false,
    lastMessage: RawMessage | null = null,
  ): RoomPreview {
    return {
      ...this.normalize(room),
      creator,
      lastMessage: lastMessage
        ? messageService.buildMessagePreview(lastMessage)
        : null,
    };
  }

  async getAll(userId: string): Promise<RoomPreview[]> {
    const rawRooms = await roomRepository.getAll(userId);

    return rawRooms.map(({ messages, members, ...room }) =>
      this.buildRoomPreview(room, members[0].creator, messages[0]),
    );
  }

  async get(id: string): Promise<NormalizedRoom | null> {
    const room = await roomRepository.get(id);

    return room ? this.normalize(room) : null;
  }

  async getOrThrow(id: string): Promise<NormalizedRoom> {
    const normalizedRoom = await this.get(id);

    if (!normalizedRoom) {
      throw ApiError.notFound('Room not found');
    }

    return normalizedRoom;
  }

  async create(
    name: string,
    tx?: PrismaTransactionClient,
  ): Promise<RoomPreview> {
    try {
      const room = await roomRepository.create(name, tx);

      return this.buildRoomPreview(room, true);
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as any).code === 'P2002'
      ) {
        throw ApiError.conflict('Creation error', {
          name: 'Room already exists',
        });
      }

      throw err;
    }
  }

  async getWithRole(id: string, userId: string): Promise<RoomWithRole> {
    const normalizedRoom = await this.getOrThrow(id);
    const member = await memberService.getOrThrow(id, userId);

    return {
      ...normalizedRoom,
      creator: member.creator,
    };
  }
}

export const roomService = new RoomService();
