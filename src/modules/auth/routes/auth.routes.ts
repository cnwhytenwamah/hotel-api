import { Router } from "express";
import rateLimit from "express-rate-limit";

import { authenticate } from "../../../middlewares/auth.middleware";

import { currentUserController, loginController, logoutController, registerController,} from "../controllers/auth.controller";

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

router.post("/register", authLimiter, registerController);

router.post("/login", authLimiter, loginController);

router.get("/me", authenticate, currentUserController);

router.post("/logout", authenticate, logoutController);

export default router;