import axios from 'axios';
import React, { useMemo, useState } from 'react';

import { User } from '../types/User';
import { authService } from '../services/authService';
import { accessTokenService } from '../services/accessTokenService';

const AuthContext = React.createContext({
  isChecked: false,
  currentUser: null as User | null,
  register: async (_name: string) => {},
  checkAuth: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  async function register(name: string) {
    const { accessToken, user } = await authService.register(name);

    setCurrentUser(user);
    accessTokenService.save(accessToken);
  }

  async function checkAuth() {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      try {
        const { accessToken, user } = await authService.refreshToken();

        setCurrentUser(user);
        accessTokenService.save(accessToken);

        break;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;

          if (typeof status === 'number' && [400, 401].includes(status)) {
            break;
          }
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setIsChecked(true);
  }

  const value = useMemo(
    () => ({
      isChecked,
      currentUser,

      register,
      checkAuth,
    }),
    [currentUser, isChecked],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => React.useContext(AuthContext);
