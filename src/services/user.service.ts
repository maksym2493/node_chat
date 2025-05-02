import { User } from '@prisma/client';
import { NormalizedUser } from '../types/NormalizedUser';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';

import { ApiError } from '../exceptions/api.error';
import { userRepository } from '../entity/user.repository';

function normalize({ id, name }: User): NormalizedUser {
  return { id, name };
}

async function create(
  name: string,
  tx?: PrismaTransactionClient,
): Promise<NormalizedUser> {
  try {
    return normalize(await userRepository.create(name, tx));
  } catch (err) {
    if (err.code === 'P2002') {
      throw ApiError.badRequest('Registration error', {
        name: 'User already exists',
      });
    }

    throw err;
  }
}

export const userService = { create, normalize };
