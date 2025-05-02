import { NormalizedUser } from './NormalizedUser';

export interface RegistrationData {
  accessToken: string;
  refreshToken: string;
  normalizedUser: NormalizedUser;
}
