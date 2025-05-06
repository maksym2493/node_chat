import { Message } from './Message';

export interface Room {
  id: string;
  name: string;
  creator: boolean;
  lastMessage?: Message;
}
