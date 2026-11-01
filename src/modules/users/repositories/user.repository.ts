import { User } from "../models/user.model";

export class UserRepository {
  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    passwordHash: string;
  }): Promise<User> {
    return User.create({
      ...data,
      phone: data.phone ?? null,
      accountType: "guest",
      status: "active",
      lastLoginAt: null,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  }

  async updateLastLogin(user: User): Promise<void> {
    await user.update({
      lastLoginAt: new Date(),
    });
  }
}

export const userRepository = new UserRepository();