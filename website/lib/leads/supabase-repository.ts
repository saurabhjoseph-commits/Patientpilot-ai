import { supabaseServer } from "@/lib/supabase-server";

import {
  toDatabaseLead,
  fromDatabaseLead,
} from "./mapper";

import type {
  Lead,
  CreateLeadRequest,
} from "./types";

const TABLE = "contacts";

/**
 * Creates a new lead.
 */
export async function createLead(
  input: CreateLeadRequest
): Promise<Lead> {
  const payload = toDatabaseLead(input);

  const { data, error } = await supabaseServer
    .from(TABLE)
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return fromDatabaseLead(data);
}

/**
 * Updates a lead's status.
 */
export async function updateLeadStatus(
  id: number,
  status: string
): Promise<Lead> {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return fromDatabaseLead(data);
}

/**
 * Deletes a lead.
 */
export async function deleteLead(
  id: number
): Promise<void> {
  const { error } = await supabaseServer
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}