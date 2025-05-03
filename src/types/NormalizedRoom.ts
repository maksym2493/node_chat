import { Message, Room } from '@prisma/client';

export type NormalizedRoom = Pick<Room, 'id' | 'name'> & {
  creator: boolean;
  lastMessage: Message | null;
};
