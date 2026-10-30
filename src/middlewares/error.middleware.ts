
import type { ErrorRequestHandler } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/app-error";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  req,
  res,
  _next
) => {
  const statusCode =
    error instanceof AppError ? error.statusCode : 500;

  const message =
    error instanceof AppError
      ? error.message
      : "Internal server error";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && {
      stack: error instanceof Error ? error.stack : undefined,
    }),
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
};
