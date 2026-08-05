/**
 * PP-002 Milestone E
 * Communication & Omnichannel Domain
 *
 * Represents a recording generated
 * from a voice call.
 */

export type CallRecordingStatus =
  | "processing"
  | "available"
  | "transcribing"
  | "archived"
  | "deleted"
  | "failed";

export type CallRecordingFormat =
  | "mp3"
  | "wav"
  | "ogg"
  | "flac"
  | "aac"
  | "other";

export interface CallRecordingStorage {

  provider: string;

  bucket?: string;

  objectKey?: string;

  url?: string;

}

export interface CallRecordingSecurity {

  encrypted: boolean;

  retentionUntil?: string;

  downloadable: boolean;

  hipaaProtected: boolean;

}

export interface CallRecordingTranscription {

  enabled: boolean;

  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed";

  transcriptDocumentId?: string;

  language?: string;

}

export interface CallRecordingMetadata {

  fileName: string;

  format: CallRecordingFormat;

  durationSeconds: number;

  fileSizeBytes: number;

  checksum?: string;

  channels?: number;

}

export interface CallRecording {

  id: string;

  tenantId: string;

  callId: string;

  status: CallRecordingStatus;

  storage: CallRecordingStorage;

  security: CallRecordingSecurity;

  transcription: CallRecordingTranscription;

  metadata: CallRecordingMetadata;

  createdAt: string;

  updatedAt: string;

}