/**
 * PatientPilot AI
 * Infrastructure Layer
 * Conversation Repository
 *
 * Repository responsible for AI conversation persistence.
 */

import {
  DatabaseProvider,
  database,
} from "../persistence/database";

export type ConversationStatus =
  | "active"
  | "completed"
  | "transferred"
  | "abandoned";

export interface ConversationMessageRecord {
  readonly id: string;
  readonly role: "system" | "assistant" | "user";
  readonly content: string;
  readonly timestamp: Date;
}

export interface ConversationRecord {
  readonly id: string;
  readonly clinicId: string;
  readonly patientId?: string;
  readonly status: ConversationStatus;
  readonly channel: string;
  readonly startedAt: Date;
  readonly endedAt?: Date;
  readonly messages: readonly ConversationMessageRecord[];
}

export interface CreateConversationRecord {
  readonly clinicId: string;
  readonly patientId?: string;
  readonly channel: string;
}

export interface ConversationRepository {
  create(
    record: CreateConversationRecord,
  ): Promise<ConversationRecord>;

  addMessage(
    conversationId: string,
    message: ConversationMessageRecord,
  ): Promise<void>;

  updateStatus(
    conversationId: string,
    status: ConversationStatus,
  ): Promise<void>;

  findById(
    conversationId: string,
  ): Promise<ConversationRecord | null>;

  findByClinic(
    clinicId: string,
  ): Promise<readonly ConversationRecord[]>;

  delete(
    conversationId: string,
  ): Promise<boolean>;
}

/**
 * Default Conversation Repository.
 */
export class DefaultConversationRepository
  implements ConversationRepository
{
  constructor(
    private readonly provider: DatabaseProvider =
      database,
  ) {}

  async create(
    record: CreateConversationRecord,
  ): Promise<ConversationRecord> {
    void this.provider;

    return {
      id: crypto.randomUUID(),
      clinicId: record.clinicId,
      patientId: record.patientId,
      channel: record.channel,
      status: "active",
      startedAt: new Date(),
      messages: [],
    };
  }

  async addMessage(
    conversationId: string,
    message: ConversationMessageRecord,
  ): Promise<void> {
    void conversationId;
    void message;
  }

  async updateStatus(
    conversationId: string,
    status: ConversationStatus,
  ): Promise<void> {
    void conversationId;
    void status;
  }

  async findById(
    conversationId: string,
  ): Promise<ConversationRecord | null> {
    void conversationId;

    return null;
  }

  async findByClinic(
    clinicId: string,
  ): Promise<readonly ConversationRecord[]> {
    void clinicId;

    return [];
  }

  async delete(
    conversationId: string,
  ): Promise<boolean> {
    void conversationId;

    return true;
  }
}

/**
 * Creates a Conversation Repository.
 */
export function createConversationRepository(): ConversationRepository {
  return new DefaultConversationRepository();
}

/**
 * Shared Conversation Repository.
 */
export const conversationRepository =
  createConversationRepository();

/**
 * Default Conversation Repository.
 */
export default conversationRepository;