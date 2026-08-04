/**
 * ============================================================
 * PatientPilot AI
 * User Repository
 * ============================================================
 *
 * Application Layer contract for user persistence and identity.
 */

import type { User } from "@/lib/platform/domain/identity";

export interface CreateUserData {
  clinicId: string;

  fullName: string;

  email: string;

  password: string;

  phone?: string;

  isActive?: boolean;

  emailVerified?: boolean;
}

export interface UpdateUserData {
  fullName?: string;

  phone?: string;

  isActive?: boolean;

  emailVerified?: boolean;
}

export interface IUserRepository {
  findById(
    userId: string,
  ): Promise<User | null>;

  findByEmail(
    email: string,
  ): Promise<User | null>;

  existsByEmail(
    email: string,
  ): Promise<boolean>;

  create(
    data: CreateUserData,
  ): Promise<User>;

  update(
    userId: string,
    data: UpdateUserData,
  ): Promise<User>;

  /**
   * Persists authentication-related changes after a successful
   * login (last login timestamp, updated audit fields, etc.).
   */
  updateLogin(
    user: User,
  ): Promise<User>;

  activate(
    userId: string,
  ): Promise<void>;

  deactivate(
    userId: string,
  ): Promise<void>;

  delete(
    userId: string,
  ): Promise<void>;
}