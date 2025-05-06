import { Room } from '../types/Room';
import { httpClient as client } from '../http/httpClient';

export const roomService = {
  getAll: (): Promise<Room[]> => {
    return client.get('/rooms');
  },

  get: (id: string): Promise<Room> => {
    return client.get(`/rooms/${id}`);
  },

  create: (name: string): Promise<Room> => {
    return client.post('/rooms', { name });
  },

  changeName: (id: string, name: string): Promise<Room> => {
    return client.patch(`/rooms/${id}`, { name });
  },

  join: (id: string): Promise<Omit<Room, 'creator' | 'lastMessage'>> => {
    return client.post(`/rooms/${id}/members`);
  },

  leave: (id: string): Promise<void> => {
    return client.delete(`/rooms/${id}/members/me`);
  },

  delete: (id: string): Promise<void> => {
    return client.delete(`/rooms/${id}`);
  },
};
