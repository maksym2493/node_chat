import EventEmitter from 'events';
import { MessagePreview } from '../types/MessagePreview';

interface MyEvents {
  delete: [{ roomId: string }];
  leave: [{ roomId: string; userId: string }];

  message: [{ roomId: string; preview: MessagePreview }];
}

export const messageEmitter = new EventEmitter<MyEvents>();
