import { User } from './User';

export interface Message {
  id: string;
  text: string;
  time: string;
  author: User;
}
