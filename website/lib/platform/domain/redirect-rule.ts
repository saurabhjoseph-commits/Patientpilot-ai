/**
 * PP-002 Milestone C
 * Global Redirect Rule Domain
 *
 * Represents HTTP redirects
 * and URL rewrite rules used
 * by the platform.
 */

export type RedirectRuleStatus =
  | "draft"
  | "active"
  | "inactive"
  | "expired";

export type RedirectRuleType =
  | "permanent"
  | "temporary"
  | "rewrite"
  | "canonical"
  | "language"
  | "geo"
  | "campaign";

export interface RedirectSource {

  domainNameId?: string;

  path: string;

}

export interface RedirectDestination {

  domainNameId?: string;

  url?: string;

  path: string;

}

export interface RedirectBehavior {

  statusCode: 301 | 302 | 307 | 308;

  preserveQueryString: boolean;

  preserveMethod: boolean;

}

export interface RedirectConditions {

  languages: string[];

  countries: string[];

  devices: ("desktop" | "tablet" | "mobile")[];

}

export interface RedirectValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface RedirectMetadata {

  description?: string;

  tags: string[];

}

export interface RedirectRule {

  id: string;

  code: string;

  status: RedirectRuleStatus;

  type: RedirectRuleType;

  source: RedirectSource;

  destination: RedirectDestination;

  behavior: RedirectBehavior;

  conditions: RedirectConditions;

  validity: RedirectValidity;

  metadata: RedirectMetadata;

  createdAt: string;

  updatedAt: string;

}