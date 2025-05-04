import { Message } from '@prisma/client';

import { roomService } from './room.service';
import { memberService } from './member.service';
import { RawMessage } from '../types/RawMessage';
import { MessagePreview } from '../types/MessagePreview';
import { NormalizedMessage } from '../types/NormalizedMessage';
import { messageRepository } from '../entity/message.repository';

class MessageService {
  normalize({ id, text, createdAt }: Message): NormalizedMessage {
    return { id, text, time: createdAt };
  }

  buildMessagePreview({
    author: { name: author },
    ...message
  }: RawMessage): MessagePreview {
    return { ...this.normalize(message), author };
  }

  async checkAccess(roomId: string, userId: string): Promise<void> {
    await roomService.getOrThrow(roomId);
    await memberService.getOrThrow(roomId, userId);
  }

  async getAll(roomId: string, userId: string): Promise<MessagePreview[]> {
    await this.checkAccess(roomId, userId);

    return (await messageRepository.getAll(roomId)).map((rawMessage) =>
      this.buildMessagePreview(rawMessage),
    );
  }

  async create(
    roomId: string,
    authorId: string,
    text: string,
  ): Promise<NormalizedMessage> {
    await this.checkAccess(roomId, authorId);

    const rawMessage = await messageRepository.create(roomId, authorId, text);

    return this.buildMessagePreview(rawMessage);
  }
}

export const messageService = new MessageService();
