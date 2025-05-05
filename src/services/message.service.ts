import { Message } from '@prisma/client';

import { roomService } from './room.service';
import { userService } from './user.service';
import { memberService } from './member.service';
import { RawMessage } from '../types/RawMessage';
import { MessagePreview } from '../types/MessagePreview';
import { NormalizedMessage } from '../types/NormalizedMessage';
import { messageRepository } from '../entity/message.repository';

class MessageService {
  normalize({ id, text, createdAt }: Message): NormalizedMessage {
    return { id, text, time: createdAt };
  }

  buildMessagePreview({ author, ...message }: RawMessage): MessagePreview {
    return {
      ...this.normalize(message),
      author: userService.normalize(author),
    };
  }

  async getAll(roomId: string, userId: string): Promise<MessagePreview[]> {
    await roomService.getWithRole(roomId, userId);
    const messages = await messageRepository.getAll(roomId);

    return messages.map((rawMessage) => this.buildMessagePreview(rawMessage));
  }

  async create(
    roomId: string,
    authorId: string,
    text: string,
  ): Promise<MessagePreview> {
    await roomService.getWithRole(roomId, authorId);
    const rawMessage = await messageRepository.create(roomId, authorId, text);

    return this.buildMessagePreview(rawMessage);
  }
}

export const messageService = new MessageService();
