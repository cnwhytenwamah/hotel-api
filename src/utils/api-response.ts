import type { Response } from "express";

interface SuccessResponseOptions<T> {
  message: string;
  data?: T;
  statusCode?: number;
}

export const sendSuccess = <T>( res: Response, options: SuccessResponseOptions<T>): Response => {
  const {
    message,
    data,
    statusCode = 200,
  } = options;

  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
  });
};

export const sendError = ( res: Response,  message: string, statusCode = 400): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};