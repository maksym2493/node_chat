import { cookie } from 'express-validator';
import { userValidation } from './user.validation';

const register = [userValidation.name];

export const authValidation = { register };
