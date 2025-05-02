import { db } from '../utils/db';
import { userService } from './user.service';
import { tokenService } from './token.service';

import { RegistrationData } from '../types/RegistrationData';
import { PrismaTransactionClient } from '../types/PrismaTransactionClient';

async function register(name: string): Promise<RegistrationData> {
  return db.$transaction(async (tx: PrismaTransactionClient) => {
    const normalizedUser = await userService.create(name, tx);
    const tokens = await tokenService.create(normalizedUser, tx);

    return { normalizedUser, ...tokens };
  });
}

export const authService = { register };
