import { z } from 'zod';

const refreshToken = z.object({
  refreshToken: z
    .string({
      required_error: 'RefreshToken is required',
      invalid_type_error: 'RefreshToken must be a string',
    })
    .jwt({ message: 'Invalid refresh token' }),
});

const accessToken = z.object({
  authorization: z
    .string({
      required_error: 'AccessToken is required',
      invalid_type_error: 'AccessToken must be a string',
    })
    .regex(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/, 'Invalid access token'),
});

export const tokenSchema = { refreshToken, accessToken };

export type AccessTokenSchema = z.infer<typeof accessToken>;
export type RefreshTokenSchema = z.infer<typeof refreshToken>;
