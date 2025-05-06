import { Message } from '../types/Message';
import { httpClient as client } from '../http/httpClient';

export const messageService = {
  getAll: async (roomId: string): Promise<Message[]> => {
    return client.get(`/rooms/${roomId}/messages`);
  },

  send: async (roomId: string, text: string): Promise<Message> => {
    return client.post(`/rooms/${roomId}/messages`, { text });
  },
};
