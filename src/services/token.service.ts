import { createHash } from 'crypto';

import { jwt } from '../utils/jwt';
import { tokenRepository } from '../entity/token.repository';

import { NormalizedUser } from '../types/NormalizedUser';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

interface CreateReturn {
  accessToken: string;
  refreshToken: string;
}

async function create(
  normalizedUser: NormalizedUser,
  tx?: PrismaTransactionClient,
): Promise<CreateReturn> {
  const accessToken = jwt.generateAccessToken(normalizedUser);
  const refreshToken = jwt.generateRefreshToken(normalizedUser);

  await tokenRepository.create(normalizedUser.id, hashToken(refreshToken), tx);

  return { accessToken, refreshToken };
}

export const tokenService = { create };
