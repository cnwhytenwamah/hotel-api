
import type { Request, Response } from "express";

import { asyncHandler } from "../../../utils/async-handler";
import { sendSuccess } from "../../../utils/api-response";
import { AppError } from "../../../utils/app-error";
import { authService } from "../services/auth.service";

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
} from "../validators/auth.validator";

const getMetadata = (req: Request) => ({
  userAgent: req.get("user-agent") ?? undefined,
  ipAddress: req.ip,
});

const getUserId = (req: Request): string => {
  if (!req.authUser) {
    throw new AppError("Authentication required.", 401);
  }

  return req.authUser.id;
};

export const registerController = asyncHandler(async (req, res) => {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    throw new AppError(validation.error.issues[0]?.message ?? "Invalid registration details.", 400);
  }

  const result = await authService.register(validation.data, getMetadata(req));

  return sendSuccess(res, "Account registered successfully.", result, 201);
});

export const loginController = asyncHandler(async (req, res) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    throw new AppError(validation.error.issues[0]?.message ?? "Invalid login details.", 400);
  }

  const result = await authService.login(validation.data, getMetadata(req));

  return sendSuccess(res, "Login successful.", result);
});

export const refreshController = asyncHandler(async (req, res) => {
  const validation = refreshTokenSchema.safeParse(req.body);

  if (!validation.success) {
    throw new AppError("A valid refresh token is required.", 400);
  }

  const result = await authService.refresh(validation.data.refreshToken);

  return sendSuccess(res, "Access token refreshed successfully.", result);
});

export const logoutController = asyncHandler(async (req, res) => {
  const validation = refreshTokenSchema.safeParse(req.body);

  if (!validation.success) {
    throw new AppError("A valid refresh token is required.", 400);
  }

  await authService.logout(validation.data.refreshToken);

  return sendSuccess(res, "Logout successful.", null);
});

export const logoutAllController = asyncHandler(async (req, res) => {
  const count = await authService.logoutAll(getUserId(req));

  return sendSuccess(res, "All sessions have been revoked.", { revokedSessions: count });
});

export const currentUserController = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(getUserId(req));

  return sendSuccess(res, "User profile retrieved successfully.", user);
});

export const getSessionsController = asyncHandler(async (req, res) => {
  const sessions = await authService.getSessions(getUserId(req));

  return sendSuccess(res, "Active sessions retrieved successfully.", sessions);
});

export const revokeSessionController = asyncHandler(async (req, res) => {
  await authService.revokeSession(
    getUserId(req),
    String(req.params.sessionId)
  );

  return sendSuccess(res, "Session revoked successfully.", null);
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  const validation = verifyEmailSchema.safeParse(req.body);

  if (!validation.success) {
    throw new AppError("A valid verification token is required.", 400);
  }

  await authService.verifyEmail(validation.data.token);

  return sendSuccess(res, "Email address verified successfully.", null);
});

export const resendVerificationController = asyncHandler(async (req, res) => {
  await authService.resendVerificationEmail(getUserId(req));

  return sendSuccess(res, "Verification email request processed.", null);
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const validation = forgotPasswordSchema.safeParse(req.body);

  if (!validation.success) {
    throw new AppError("A valid email address is required.", 400);
  }

  await authService.forgotPassword(validation.data.email);

  return sendSuccess(
    res,
    "If an account exists with that email, password reset instructions will be sent.",
    null
  );
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const validation = resetPasswordSchema.safeParse(req.body);

  if (!validation.success) {
    throw new AppError(validation.error.issues[0]?.message ?? "Invalid password reset details.", 400);
  }

  await authService.resetPassword(
    validation.data.token,
    validation.data.password
  );

  return sendSuccess(res, "Password reset successfully. Please log in again.", null);
});

export const changePasswordController = asyncHandler(async (req, res) => {
  const validation = changePasswordSchema.safeParse(req.body);

  if (!validation.success) {
    throw new AppError(validation.error.issues[0]?.message ?? "Invalid password details.", 400);
  }

  await authService.changePassword(getUserId(req), validation.data);

  return sendSuccess(res, "Password changed successfully. Please log in again.", null);
});
