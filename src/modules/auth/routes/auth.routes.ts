
import { Router } from "express";
import rateLimit from "express-rate-limit";

import { authenticate } from "../../../middlewares/auth.middleware";

import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  logoutAllController,
  currentUserController,
  getSessionsController,
  revokeSessionController,
  verifyEmailController,
  resendVerificationController,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController,
} from "../controllers/auth.controller";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

const recoveryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

router.post("/register", authLimiter, registerController);
router.post("/login", authLimiter, loginController);
router.post("/refresh", recoveryLimiter, refreshController);
router.post("/logout", logoutController);

router.get("/me", authenticate, currentUserController);

router.post("/logout-all", authenticate, logoutAllController);

router.get("/sessions", authenticate, getSessionsController);
router.delete("/sessions/:sessionId", authenticate, revokeSessionController);

router.post("/verify-email", recoveryLimiter, verifyEmailController);
router.post("/resend-verification", authenticate, recoveryLimiter, resendVerificationController);

router.post("/forgot-password", recoveryLimiter, forgotPasswordController);
router.post("/reset-password", recoveryLimiter, resetPasswordController);
router.patch("/change-password", authenticate, changePasswordController);

export default router;
