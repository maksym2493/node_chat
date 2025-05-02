import { RequestHandler, Response } from 'express';

import { AuthData } from '../types/AuthData';
import { authService } from '../services/auth.service';
import { tokenService } from '../services/token.service';

const register: RequestHandler = async (req, res) => {
  const { name } = req.body;
  const authData = await authService.register(name);

  await sendAuthentication(res, authData);
};

const refreshToken: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string;
  const authData = await tokenService.refresh(refreshToken);

  await sendAuthentication(res, authData);
};

async function sendAuthentication(
  res: Response,
  { refreshToken, normalizedUser: user, ...otherData }: AuthData,
) {
  res.cookie('refreshToken', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.json({
    message: 'OK',

    user,
    ...otherData,
  });
}

export const authController = { register, refreshToken };
