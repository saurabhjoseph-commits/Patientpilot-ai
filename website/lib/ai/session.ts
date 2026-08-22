import type { AIConversationSession, AIConversationState, AIIntent, AIMessage, AppointmentData, PatientData, ConversationAnalysis } from "./core";
import { createConversationLanguageState, updateConversationLanguageState, type ClinicLanguageMode, type LanguageDetection } from "@/lib/platform/domain/clinic-language";
import { conversationSessionStore } from "./session-store";

const now = () => new Date().toISOString();
export async function createSession(clinicId: string, callId: string, mode: ClinicLanguageMode = "english"): Promise<AIConversationSession> {
  const existing = await conversationSessionStore().load(clinicId, callId);
  if (existing) return existing;
  const timestamp = now();
  const session: AIConversationSession = { id: crypto.randomUUID(), clinicId, callId, callSid: callId, state: "greeting", intent: "unknown", patient: {}, appointment: { confirmed: false }, messages: [], analysis: undefined, missingFields: [], currentStep: "greeting", confidence: 1, completed: false, needsHuman: false, language: createConversationLanguageState(mode), recognitionFailureCount: 0, createdAt: timestamp, updatedAt: timestamp };
  await conversationSessionStore().save(session);
  return session;
}
export const getSession = (clinicId: string, callId: string) => conversationSessionStore().load(clinicId, callId);
export async function requireSession(clinicId: string, callId: string): Promise<AIConversationSession> { const session = await getSession(clinicId, callId); if (!session) throw new Error("Conversation session is missing, completed, or expired."); return session; }
export async function saveSession(session: AIConversationSession): Promise<void> { session.updatedAt = now(); await conversationSessionStore().save(session); }
export const deleteSession = (clinicId: string, callId: string) => conversationSessionStore().remove(clinicId, callId);
async function mutate(clinicId: string, callId: string, fn: (s: AIConversationSession) => void): Promise<AIConversationSession> { const session = await requireSession(clinicId, callId); fn(session); await saveSession(session); return session; }
export const addMessage = (c: string, id: string, v: AIMessage) => mutate(c, id, s => { s.messages.push(v); });
export const updatePatient = (c: string, id: string, v: Partial<PatientData>) => mutate(c, id, s => { s.patient = { ...s.patient, ...v }; });
export const updateAppointment = (c: string, id: string, v: Partial<AppointmentData>) => mutate(c, id, s => { s.appointment = { ...s.appointment, ...v }; });
export const updateState = (c: string, id: string, v: AIConversationState) => mutate(c, id, s => { s.state = v; });
export const updateIntent = (c: string, id: string, v: AIIntent) => mutate(c, id, s => { s.intent = v; });
export const updateAnalysis = (c: string, id: string, v: ConversationAnalysis) => mutate(c, id, s => { s.analysis = v; });
export const setMissingFields = (c: string, id: string, v: string[]) => mutate(c, id, s => { s.missingFields = v; });
export const setCurrentStep = (c: string, id: string, v: string) => mutate(c, id, s => { s.currentStep = v; });
export const setConfidence = (c: string, id: string, v: number) => mutate(c, id, s => { s.confidence = v; });
export const markCompleted = (c: string, id: string) => mutate(c, id, s => { s.completed = true; s.endedAt = now(); });
export const requestHumanTransfer = (c: string, id: string) => mutate(c, id, s => { s.needsHuman = true; });
export const configureSessionLanguage = (c: string, id: string, mode: ClinicLanguageMode) => mutate(c, id, s => { if (s.language.configuredMode !== mode) s.language = createConversationLanguageState(mode); });
export const updateSessionLanguage = (c: string, id: string, detection: LanguageDetection) => mutate(c, id, s => { s.language = updateConversationLanguageState(s.language, detection); });
export const recordRecognitionFailure = (c: string, id: string) => mutate(c, id, s => { s.recognitionFailureCount += 1; });
export const resetRecognitionFailures = (c: string, id: string) => mutate(c, id, s => { s.recognitionFailureCount = 0; });
