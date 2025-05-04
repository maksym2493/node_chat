import { Room } from '@prisma/client';
import { RawMessage } from '../types/RawMessage';
import { RoomPreview } from '../types/RoomPreview';
import { NormalizedRoom } from '../types/NormalizedRoom';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';

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

  async create(
    name: string,
    tx?: PrismaTransactionClient,
  ): Promise<RoomPreview> {
    try {
      const room = await roomRepository.create(name, tx);

      return this.buildRoomPreview(room, true);
    } catch (err) {
      throw err;
    }
  }

  async getWithRole(id: string, userId: string): Promise<RoomWithRole> {
    const roomWithRole = await roomRepository.getWithRole(id, userId);

    if (!roomWithRole) {
      throw ApiError.notFound('Room not found');
    }

    const { members, ...room } = roomWithRole;

    if (!members.length) {
      throw ApiError.forbidden();
    }

    return {
      ...this.normalize(room),
      creator: members[0].creator,
    };
  }
}

export const roomService = new RoomService();
