import { User } from '../types/User';
import { authClient as client } from '../http/authClient';

interface AuthData {
  user: User;
  accessToken: string;
}

export const authService = {
  register: (name: string): Promise<AuthData> => {
    return client.post('/registration', { name });
  },

  refreshToken: (): Promise<AuthData> => client.post('/refresh-token'),
};
