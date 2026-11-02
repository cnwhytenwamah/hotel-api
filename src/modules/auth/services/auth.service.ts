
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { sequelize } from "../../../config/database";
import { env } from "../../../config/env";
import { AppError } from "../../../utils/app-error";
import { generateSecureToken, getExpiryDate, hashToken } from "../../../utils/secure-token";
import { userRepository } from "../../users/repositories/user.repository";
import { sessionRepository } from "../repositories/session.repository";
import { emailService } from "./email.service";
import type { User } from "../../users/models/user.model";
import type {
  LoginInput,
  RegisterInput,
  ChangePasswordInput,
} from "../validators/auth.validator";

const SALT_ROUNDS = 12;

interface SafeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  accountType: "guest" | "staff";
  status: "active" | "suspended";
  emailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

interface SessionMetadata {
  userAgent?: string;
  ipAddress?: string;
}

interface AuthResult {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

const generateAccessToken = (userId: string, email: string): string => {
  return jwt.sign(
    { email },
    env.JWT_SECRET,
    {
      subject: userId,
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    }
  );
};

const toSafeUser = (user: User): SafeUser => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  accountType: user.accountType,
  status: user.status,
  emailVerified: Boolean(user.emailVerifiedAt),
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
});

export class AuthService {
  private async createSession(
    user: User,
    metadata: SessionMetadata = {}
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = generateSecureToken();

    await sessionRepository.create({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: getExpiryDate(env.REFRESH_TOKEN_EXPIRES_IN),
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
    });

    return {
      accessToken: generateAccessToken(user.id, user.email),
      refreshToken,
    };
  }

  async register(
    input: RegisterInput,
    metadata: SessionMetadata = {}
  ): Promise<AuthResult> {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError("An account with this email address already exists.", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const verificationToken = generateSecureToken();

    const user = await userRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      passwordHash,
    });

    await user.update({
      emailVerificationTokenHash: hashToken(verificationToken),
      emailVerificationExpiresAt: getExpiryDate("24h"),
    });

    const tokens = await this.createSession(user, metadata);

    try {
      await emailService.sendVerificationEmail(
        user.email,
        user.firstName,
        verificationToken
      );
    } catch (error) {
      console.error("Verification email could not be sent:", error);
    }

    return {
      user: toSafeUser(user),
      ...tokens,
    };
  }

  async login(
    input: LoginInput,
    metadata: SessionMetadata = {}
  ): Promise<AuthResult> {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError("Invalid email address or password.", 401);
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Invalid email address or password.", 401);
    }

    if (user.status !== "active") {
      throw new AppError("This account has been suspended.", 403);
    }

    await userRepository.updateLastLogin(user);

    const tokens = await this.createSession(user, metadata);

    return {
      user: toSafeUser(user),
      ...tokens,
    };
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    const tokenHash = hashToken(refreshToken);

    return sequelize.transaction(async (transaction) => {
      const session = await sessionRepository.findByTokenHash(
        tokenHash,
        transaction
      );

      if (!session) {
        throw new AppError("Invalid refresh token.", 401);
      }

      if (session.revokedAt) {
        // Reuse of a rotated token may indicate token theft.
        await sessionRepository.revokeAllForUser(session.userId);
        throw new AppError("Refresh token reuse detected. Please log in again.", 401);
      }

      if (session.expiresAt <= new Date()) {
        await sessionRepository.revoke(session, transaction);
        throw new AppError("Refresh token has expired.", 401);
      }

      const user = await userRepository.findById(session.userId);

      if (!user || user.status !== "active") {
        await sessionRepository.revoke(session, transaction);
        throw new AppError("User account is unavailable.", 401);
      }

      const newRefreshToken = generateSecureToken();

      const newSession = await sessionRepository.create(
        {
          userId: user.id,
          tokenHash: hashToken(newRefreshToken),
          expiresAt: getExpiryDate(env.REFRESH_TOKEN_EXPIRES_IN),
          userAgent: session.userAgent,
          ipAddress: session.ipAddress,
        },
        transaction
      );

      await session.update(
        {
          revokedAt: new Date(),
          replacedBySessionId: newSession.id,
        },
        { transaction }
      );

      return {
        user: toSafeUser(user),
        accessToken: generateAccessToken(user.id, user.email),
        refreshToken: newRefreshToken,
      };
    });
  }

  async logout(refreshToken: string): Promise<void> {
    const session = await sessionRepository.findByTokenHash(hashToken(refreshToken));

    if (session && !session.revokedAt) {
      await sessionRepository.revoke(session);
    }
  }

  async logoutAll(userId: string): Promise<number> {
    return sessionRepository.revokeAllForUser(userId);
  }

  async getSessions(userId: string) {
    return sessionRepository.findActiveByUser(userId);
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    const revoked = await sessionRepository.revokeById(sessionId, userId);

    if (!revoked) {
      throw new AppError("Active session not found.", 404);
    }
  }

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await userRepository.findById(userId);

    if (!user || user.status !== "active") {
      throw new AppError("User account could not be found or is inactive.", 401);
    }

    return toSafeUser(user);
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.findUserByVerificationToken(token);

    if (!user || !user.emailVerificationExpiresAt ||
        user.emailVerificationExpiresAt <= new Date()) {
      throw new AppError("Verification link is invalid or has expired.", 400);
    }

    await user.update({
      emailVerifiedAt: new Date(),
      emailVerificationTokenHash: null,
      emailVerificationExpiresAt: null,
    });
  }

  async resendVerificationEmail(userId: string): Promise<void> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (user.emailVerifiedAt) {
      throw new AppError("Your email address is already verified.", 400);
    }

    const token = generateSecureToken();

    await user.update({
      emailVerificationTokenHash: hashToken(token),
      emailVerificationExpiresAt: getExpiryDate("24h"),
    });

    await emailService.sendVerificationEmail(user.email, user.firstName, token);
  }

  private async findUserByVerificationToken(token: string): Promise<User | null> {
    const { User } = await import("../../users/models/user.model.js");

    return User.findOne({
      where: { emailVerificationTokenHash: hashToken(token) },
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await userRepository.findByEmail(email);

    if (!user || user.status !== "active") {
      return;
    }

    const token = generateSecureToken();

    await user.update({
      passwordResetTokenHash: hashToken(token),
      passwordResetExpiresAt: getExpiryDate("30m"),
    });

    await emailService.sendPasswordResetEmail(user.email, user.firstName, token);
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const { User } = await import("../../users/models/user.model.js");

    const user = await User.findOne({
      where: { passwordResetTokenHash: hashToken(token) },
    });

    if (!user || !user.passwordResetExpiresAt ||
        user.passwordResetExpiresAt <= new Date()) {
      throw new AppError("Password reset link is invalid or has expired.", 400);
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await user.update({
      passwordHash,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
    });

    await sessionRepository.revokeAllForUser(user.id);
  }

  async changePassword(
    userId: string,
    input: ChangePasswordInput
  ): Promise<void> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const matches = await bcrypt.compare(input.currentPassword, user.passwordHash);

    if (!matches) {
      throw new AppError("Your current password is incorrect.", 400);
    }

    if (input.currentPassword === input.newPassword) {
      throw new AppError("Your new password must be different.", 400);
    }

    const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);

    await user.update({ passwordHash });
    await sessionRepository.revokeAllForUser(user.id);
  }
}

export const authService = new AuthService();
