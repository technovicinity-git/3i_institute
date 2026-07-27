import { Response } from 'express';

interface ApiResponseOptions {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: unknown;
  meta?: Record<string, unknown>;
}

export const sendSuccess = ({
  res,
  statusCode = 200,
  message = 'Success',
  data = null,
  meta,
}: ApiResponseOptions) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

export const sendError = ({
  res,
  statusCode = 500,
  message = 'Internal server error',
}: ApiResponseOptions) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
