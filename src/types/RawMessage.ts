import { Message } from '@prisma/client';

export type RawMessage = Message & { author: { name: string } };
