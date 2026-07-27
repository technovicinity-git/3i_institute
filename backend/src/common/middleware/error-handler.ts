import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/common/errors';
import { config } from '@/config/app';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(config.app.env === 'development' && { stack: err.stack }),
    });
  }

  console.error('Unexpected error:', err);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(config.app.env === 'development' && { stack: err.stack }),
  });
};
