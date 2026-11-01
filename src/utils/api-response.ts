
import type { Response } from "express";

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200
): Response<SuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
