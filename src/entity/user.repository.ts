import { db } from '../utils/db';
import { User } from '@prisma/client';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';

function create(name: string, tx?: PrismaTransactionClient): Promise<User> {
  return (tx || db).user.create({
    data: {
      name,
    },
  });
}

export const userRepository = { create };
