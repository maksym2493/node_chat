import { db } from '../utils/db';
import { Token } from '@prisma/client';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';

async function create(
  userId: string,
  token: string,
  tx?: PrismaTransactionClient,
): Promise<Token> {
  return (tx || db).token.create({
    data: { token, userId },
  });
}

export const tokenRepository = { create };
