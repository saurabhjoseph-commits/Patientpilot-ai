/**
 * ============================================================
 * PatientPilot AI
 * BCrypt Password Hasher
 * ============================================================
 *
 * Infrastructure implementation of IPasswordHasher.
 *
 * Uses bcrypt for secure password hashing.
 */

import bcrypt from "bcryptjs";

import type { IPasswordHasher } from "@/lib/application/interfaces/IPasswordHasher";

const DEFAULT_COST = 12;

export class PasswordHasher
  implements IPasswordHasher
{
  constructor(
    private readonly cost: number = DEFAULT_COST,
  ) {}

  /**
   * Creates a secure password hash.
   */
  async hash(
    password: string,
  ): Promise<string> {
    return bcrypt.hash(
      password,
      this.cost,
    );
  }

  /**
   * Verifies a password against
   * an existing hash.
   */
  async verify(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(
      password,
      passwordHash,
    );
  }

  /**
   * Determines whether the stored hash
   * should be regenerated using the
   * current hashing cost.
   */
  async needsRehash(
    passwordHash: string,
  ): Promise<boolean> {
    const rounds =
      bcrypt.getRounds(passwordHash);

    return rounds < this.cost;
  }
}