import { RequestHandler } from 'express';

const register: RequestHandler = (req, res) => {
  const { name } = req.body;

  res.send();
};

const refreshToken: RequestHandler = (req, res) => {};

export const authController = { register, refreshToken };
