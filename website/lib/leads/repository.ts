import type { CreateLeadRequest } from "./types";

export interface LeadRepository {
  create(
    lead: CreateLeadRequest,
  ): Promise<void>;
}