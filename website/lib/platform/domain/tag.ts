/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a reusable classification label that can be
 * attached to business entities across the platform.
 */

export type TagCategory =
  | "crm"
  | "marketing"
  | "patient"
  | "appointment"
  | "billing"
  | "workflow"
  | "ai"
  | "system"
  | "custom";

export type TagColor =
  | "gray"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "red"
  | "purple"
  | "pink"
  | "teal"
  | "indigo";

export interface TagMetadata {

  description?: string;

  icon?: string;

  system: boolean;

  archived: boolean;

}

export interface Tag {

  id: string;

  tenantId: string;

  clinicId?: string;

  category: TagCategory;

  name: string;

  color: TagColor;

  metadata: TagMetadata;

  createdAt: string;

  updatedAt: string;

}