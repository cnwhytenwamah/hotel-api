import type { Transaction } from "sequelize";
import { Op } from "sequelize";

import { UserSession } from "../models/user-session.model";

interface CreateSessionInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string | null;
  ipAddress?: string | null;
}

export class SessionRepository {
  async create(
    input: CreateSessionInput,
    transaction?: Transaction
  ): Promise<UserSession> {
    return UserSession.create(
      {
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        revokedAt: null,
        replacedBySessionId: null,
        userAgent: input.userAgent ?? null,
        ipAddress: input.ipAddress ?? null,
      },
      { transaction }
    );
  }

  async findByTokenHash(
    tokenHash: string,
    transaction?: Transaction
  ): Promise<UserSession | null> {
    return UserSession.findOne({
      where: { tokenHash },
      transaction,
      ...(transaction
        ? { lock: transaction.LOCK.UPDATE }
        : {}),
    });
  }

  async findById(id: string): Promise<UserSession | null> {
    return UserSession.findByPk(id);
  }

  async revoke(
    session: UserSession,
    transaction?: Transaction
  ): Promise<void> {
    await session.update(
      { revokedAt: new Date() },
      { transaction }
    );
  }

  async revokeAllForUser(userId: string): Promise<number> {
    const [count] = await UserSession.update(
      { revokedAt: new Date() },
      {
        where: {
          userId,
          revokedAt: null,
          expiresAt: { [Op.gt]: new Date() },
        },
      }
    );

    return count;
  }

  async findActiveByUser(userId: string): Promise<UserSession[]> {
    return UserSession.findAll({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { [Op.gt]: new Date() },
      },
      attributes: [
        "id",
        "userId",
        "expiresAt",
        "userAgent",
        "ipAddress",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async revokeById(
    id: string,
    userId: string
  ): Promise<boolean> {
    const [count] = await UserSession.update(
      { revokedAt: new Date() },
      {
        where: {
          id,
          userId,
          revokedAt: null,
        },
      }
    );

    return count > 0;
  }
}

export const sessionRepository = new SessionRepository();
