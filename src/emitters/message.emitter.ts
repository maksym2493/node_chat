import EventEmitter from 'events';
import { MessagePreview } from '../types/MessagePreview';

interface MyEvents {
  message: [{ roomId: string; preview: MessagePreview }];
}

export const messageEmitter = new EventEmitter<MyEvents>();
