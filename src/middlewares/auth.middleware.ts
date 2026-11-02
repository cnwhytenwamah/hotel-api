import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { AppError } from "../utils/app-error";
import { userRepository } from "../modules/users/repositories/user.repository";

export const authenticate: RequestHandler = async (
  req,
  _res,
  next
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError("Authentication token is required.", 401);
    }

    const token = authorization.substring(7);
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (
      typeof decoded === "string" ||
      !decoded.sub ||
      typeof decoded.email !== "string"
    ) {
      throw new AppError("Invalid authentication token.", 401);
    }

    const user = await userRepository.findById(decoded.sub);

    if (!user || user.status !== "active") {
      throw new AppError(
        "Your account is unavailable or inactive.",
        401
      );
    }

    req.authUser = {
      id: user.id,
      email: user.email,
      accountType: user.accountType,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      next(new AppError("Invalid or expired authentication token.", 401));
      return;
    }

    next(error);
  }
};

export const requireStaff: RequestHandler = (
  req,
  _res,
  next
) => {
  if (!req.authUser) {
    next(new AppError("Authentication is required.", 401));
    return;
  }

  if (req.authUser.accountType !== "staff") {
    next(new AppError("Staff access is required.", 403));
    return;
  }

  next();
};
