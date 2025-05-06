const KEY = 'accessToken';

export const accessTokenService = {
  get: () => localStorage.getItem(KEY),
  save: (token: string) => localStorage.setItem(KEY, token),
  remove: () => localStorage.removeItem(KEY),
};
