import "server-only";
import { supabaseServer } from "@/lib/supabase-server";
import type { AIConversationSession } from "./core";

export interface ConversationSessionStore {
  load(clinicId: string, callId: string): Promise<AIConversationSession | null>;
  save(session: AIConversationSession): Promise<void>;
  remove(clinicId: string, callId: string): Promise<boolean>;
}

export class SupabaseConversationSessionStore implements ConversationSessionStore {
  async load(clinicId: string, callId: string): Promise<AIConversationSession | null> {
    const { data, error } = await supabaseServer.from("conversation_sessions").select("session_data,status,expires_at").eq("clinic_id", clinicId).eq("call_sid", callId).maybeSingle();
    if (error) throw error;
    if (!data || data.status !== "active" || new Date(data.expires_at).getTime() <= Date.now()) return null;
    const session = data.session_data as AIConversationSession;
    return session.clinicId === clinicId && session.callId === callId ? session : null;
  }
  async save(session: AIConversationSession): Promise<void> {
    const status = session.completed ? "completed" : session.needsHuman ? "transferred" : "active";
    const { error } = await supabaseServer.from("conversation_sessions").upsert({ id: session.id, clinic_id: session.clinicId, call_sid: session.callId, status, conversation_state: session.state, appointment_state: session.appointment, patient_state: session.patient, language_mode: session.language.configuredMode, current_language: session.language.currentPatientLanguage, primary_language: session.language.detectedPrimaryLanguage, language_confidence: session.language.confidence ?? null, code_switching: session.language.codeSwitchingOccurred, confidence: session.confidence, session_data: session, started_at: session.createdAt, updated_at: session.updatedAt, ended_at: session.endedAt ?? null, expires_at: new Date(Date.now() + 86400000).toISOString() }, { onConflict: "clinic_id,call_sid" });
    if (error) throw error;
    if (session.messages.length > 0) {
      const { data: call, error: callError } = await supabaseServer.from("calls").select("id").eq("clinic_id", session.clinicId).eq("call_sid", session.callId).single();
      if (callError) throw callError;
      const { error: messageError } = await supabaseServer.from("call_messages").upsert(session.messages.map(message => ({ id: message.id, call_id: call.id, clinic_id: session.clinicId, sender: message.speaker, message: message.content, created_at: message.timestamp })));
      if (messageError) throw messageError;
    }
  }
  async remove(clinicId: string, callId: string): Promise<boolean> {
    const { data, error } = await supabaseServer.from("conversation_sessions").delete().eq("clinic_id", clinicId).eq("call_sid", callId).select("id");
    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }
}

let activeStore: ConversationSessionStore = new SupabaseConversationSessionStore();
export const conversationSessionStore = () => activeStore;
export function setConversationSessionStoreForTests(store: ConversationSessionStore): void { activeStore = store; }
