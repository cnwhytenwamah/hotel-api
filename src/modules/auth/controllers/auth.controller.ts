import type { Request, Response } from "express";

import { asyncHandler } from "../../../utils/async-handler";
import { sendSuccess } from "../../../utils/api-response";
import { AppError } from "../../../utils/app-error";

import { authService } from "../services/auth.service";
import { loginSchema, registerSchema,} from "../validators/auth.validator";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      throw new AppError(
        validation.error.issues[0]?.message ?? "Invalid registration details.",
        400
      );
    }

    const result = await authService.register(validation.data);

    return sendSuccess(
      res,
      "Account registered successfully.",
      result,
      201
    );
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      throw new AppError(
        validation.error.issues[0]?.message ?? "Invalid login details.",
        400
      );
    }

    const result = await authService.login(validation.data);

    return sendSuccess(
      res,
      "Login successful.",
      result
    );
  }
);

export const currentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.authUser) {
      throw new AppError("Authentication required.", 401);
    }

    const user = await authService.getCurrentUser(
      req.authUser.id
    );

    return sendSuccess(
      res,
      "User profile retrieved successfully.",
      user
    );
  }
);

export const logoutController = asyncHandler(
  async (_req: Request, res: Response) => {
    return sendSuccess(
      res,
      "Logout successful. Please discard your access token.",
      null
    );
  }
);