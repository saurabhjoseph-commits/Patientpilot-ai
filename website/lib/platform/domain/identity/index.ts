/**
 * ============================================================
 * PatientPilot AI
 * Identity Domain
 * ============================================================
 *
 * Public exports for the Identity Domain.
 *
 * The Application Layer should import from this file instead
 * of referencing internal files directly.
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export * from "./identity.types";
export * from "./permission-catalog";

/* -------------------------------------------------------------------------- */
/* Enums                                                                      */
/* -------------------------------------------------------------------------- */

export * from "./enums/authentication-provider";
export * from "./enums/session-status";
export * from "./enums/user-status";

/* -------------------------------------------------------------------------- */
/* Value Objects                                                              */
/* -------------------------------------------------------------------------- */

export * from "./value-objects/email-address";
export * from "./value-objects/password-hash";
export * from "./value-objects/permission-code";
export * from "./value-objects/role-code";
export * from "./value-objects/session-id";

/* -------------------------------------------------------------------------- */
/* Entities                                                                   */
/* -------------------------------------------------------------------------- */

export * from "./entities/user";
export * from "./entities/user-credential";
export * from "./entities/user-session";
export * from "./entities/role";
export * from "./entities/permission";
export * from "./entities/role-assignment";

/* -------------------------------------------------------------------------- */
/* Domain Services                                                            */
/* -------------------------------------------------------------------------- */

export * from "./services/authorization-service";
export * from "./services/resource-authorization-service";

/* -------------------------------------------------------------------------- */
/* Domain Events                                                              */
/* -------------------------------------------------------------------------- */

export * from "./events/user-authenticated";
export * from "./events/user-logged-out";
export * from "./events/password-changed";
export * from "./events/role-assigned";
export * from "./events/role-revoked";
export * from "./events/permission-granted";
export * from "./events/permission-revoked";
