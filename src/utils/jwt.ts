import jsonwebtoken from 'jsonwebtoken';
import { NormalizedUser } from '../types/NormalizedUser';

const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY as string;
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY as string;

function generateAccessToken(data: NormalizedUser): string {
  return jsonwebtoken.sign(data, JWT_ACCESS_KEY, {
    expiresIn: '10m',
  });
}

function validateAccessToken(token: string): NormalizedUser | undefined {
  try {
    return jsonwebtoken.verify(token, JWT_ACCESS_KEY) as NormalizedUser;
  } catch (_) {}
}

function generateRefreshToken(data: NormalizedUser): string {
  return jsonwebtoken.sign(data, JWT_REFRESH_KEY, {
    expiresIn: '7d',
  });
}

function validateRefreshToken(token: string): NormalizedUser | undefined {
  try {
    return jsonwebtoken.verify(token, JWT_REFRESH_KEY) as NormalizedUser;
  } catch (_) {}
}

export const jwt = {
  generateAccessToken,
  validateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
};
