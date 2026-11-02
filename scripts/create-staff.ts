
import bcrypt from "bcryptjs";

import { sequelize } from "../src/config/database";
import { env } from "../src/config/env";
import { User } from "../src/modules/users/models/user.model";

const createStaff = async (): Promise<void> => {
  if (env.NODE_ENV === "production") {
    throw new Error("This script cannot run in production.");
  }

  const firstName = process.env.STAFF_FIRST_NAME?.trim();
  const lastName = process.env.STAFF_LAST_NAME?.trim();
  const email = process.env.STAFF_EMAIL?.trim().toLowerCase();
  const phone = process.env.STAFF_PHONE?.trim() || null;
  const password = process.env.STAFF_PASSWORD;

  if (!firstName || !lastName || !email || !password) {
    throw new Error(
      "Missing staff credentials. Check STAFF_FIRST_NAME, STAFF_LAST_NAME, STAFF_EMAIL and STAFF_PASSWORD in .env."
    );
  }

  if (password.length < 8) {
    throw new Error("Staff password must contain at least 8 characters.");
  }

  try {
    await sequelize.authenticate();

    console.log("Database connected successfully.");

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.accountType === "staff") {
        console.log("A staff account with this email already exists.");
        return;
      }

      throw new Error(
        "This email already belongs to a guest account. No account changes were made."
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const staff = await User.create({
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      accountType: "staff",
      status: "active",
      lastLoginAt: null,
      emailVerifiedAt: new Date(),
      emailVerificationTokenHash: null,
      emailVerificationExpiresAt: null,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
    });

    console.log("\nStaff account created successfully!");
    console.log("-----------------------------------");
    console.log(`Name: ${staff.firstName} ${staff.lastName}`);
    console.log(`Email: ${staff.email}`);
    console.log(`Account type: ${staff.accountType}`);
    console.log(`Status: ${staff.status}`);
    console.log("-----------------------------------");
  } finally {
    await sequelize.close();
  }
};

createStaff().catch((error: unknown) => {
  console.error(
    "Failed to create staff account:",
    error instanceof Error ? error.message : error
  );

  process.exitCode = 1;
});
