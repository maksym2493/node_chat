import { Member } from '@prisma/client';
import { roomService } from './room.service';
import { memberRepository } from '../entity/member.repository';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';

import { ApiError } from '../exceptions/api.error';
import { NormalizedRoom } from '../types/NormalizedRoom';

class MemberService {
  async create(
    roomId: string,
    userId: string,
    creator: boolean,
    tx?: PrismaTransactionClient,
  ): Promise<Member> {
    const member = await memberRepository.create(roomId, userId, creator, tx);

    return member;
  }

  async join(roomName: string, userId: string): Promise<NormalizedRoom> {
    const normalizedRoom = await roomService.getByName(roomName);

    if (!normalizedRoom) {
      throw ApiError.badRequest('Joining error', {
        name: 'Room with this name does not exist',
      });
    }

    try {
      await memberRepository.create(normalizedRoom.id, userId, false);
      return normalizedRoom;
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as any).code === 'P2002'
      ) {
        throw ApiError.badRequest('Joining error', {
          name: 'Room already in your list',
        });
      }

      throw err;
    }
  }
}

export const memberService = new MemberService();
