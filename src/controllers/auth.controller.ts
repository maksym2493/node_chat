import { RequestHandler, Response } from 'express';
import { authService } from '../services/auth.service';
import { RegistrationData } from '../types/RegistrationData';

const register: RequestHandler = async (req, res) => {
  const { name } = req.body;
  const registrationData = await authService.register(name);

  await sendAuthentication(res, registrationData);
};

const refreshToken: RequestHandler = (req, res) => {};

async function sendAuthentication(
  res: Response,
  { refreshToken, normalizedUser: user, ...otherData }: RegistrationData,
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
