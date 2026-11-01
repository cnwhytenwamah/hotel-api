
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../../../config/env";
import { AppError } from "../../../utils/app-error";
import { userRepository } from "../../users/repositories/user.repository";
import type { User } from "../../users/models/user.model";

import type {
  LoginInput,
  RegisterInput,
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
  lastLoginAt: Date | null;
  createdAt: Date;
}

interface AuthResult {
  user: SafeUser;
  accessToken: string;
}

const generateAccessToken = (
  userId: string,
  email: string
): string => {
  return jwt.sign(
    { email },
    env.JWT_SECRET,
    {
      subject: userId,
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    }
  );
};

const toSafeUser = (user: User): SafeUser => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    accountType: user.accountType,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
};

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await userRepository.findByEmail(
      input.email
    );

    if (existingUser) {
      throw new AppError(
        "An account with this email address already exists.",
        409
      );
    }

    const passwordHash = await bcrypt.hash(
      input.password,
      SALT_ROUNDS
    );

    const user = await userRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      passwordHash,
    });

    const accessToken = generateAccessToken(
      user.id,
      user.email
    );

    return {
      user: toSafeUser(user),
      accessToken,
    };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await userRepository.findByEmail(
      input.email
    );

    if (!user) {
      throw new AppError(
        "Invalid email address or password.",
        401
      );
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new AppError(
        "Invalid email address or password.",
        401
      );
    }

    if (user.status !== "active") {
      throw new AppError(
        "This account has been suspended. Please contact the hotel.",
        403
      );
    }

    await userRepository.updateLastLogin(user);

    const accessToken = generateAccessToken(
      user.id,
      user.email
    );

    return {
      user: toSafeUser(user),
      accessToken,
    };
  }

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await userRepository.findById(userId);

    if (!user || user.status !== "active") {
      throw new AppError(
        "User account could not be found or is inactive.",
        401
      );
    }

    return toSafeUser(user);
  }
}

export const authService = new AuthService();
