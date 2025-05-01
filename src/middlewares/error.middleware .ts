import { ErrorRequestHandler } from 'express';
import { ApiError } from '../exceptions/api.error';

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message, errors: err.errors });
    return;
  }

  if (err instanceof SyntaxError) {
    res.status(400).json({ message: 'Invalid JSON syntax' });
    return;
  }

  res.status(500).json({ message: 'Internal Server Error' });
};

// 422 Unprocessable Entity — для помилок валідації даних (коли дані мають правильну структуру, але певні поля не відповідають вимогам).
// 400 Bad Request — якщо дані взагалі не можуть бути прийняті через некоректну структуру або формат.
