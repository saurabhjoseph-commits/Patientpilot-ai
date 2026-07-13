import {
  addEvent,
  addTranscriptMessage,
  clearLiveCalls,
  createLiveCall,
  getActiveCallCount,
  getAllLiveCalls,
  getCompletedCallCount,
  getFailedCallCount,
  getLiveCall,
  removeLiveCall,
  setCallError,
  updateAIState,
  updateCallStatus,
  updateDuration,
  updateIntent,
  updateTokenUsage,
} from "./call-monitor";

import type {
  LiveCall,
  LiveCallEvent,
  LiveCallStatus,
  TokenUsage,
  TranscriptMessage,
} from "@/types/live-monitor";

import type {
  AIConversationState,
  AIIntent,
} from "@/lib/ai/types";

/**
 * ============================================================
 * PatientPilot AI
 * Live Monitor Service
 * ============================================================
 *
 * Public interface for the Live Conversation Monitor.
 * Other modules should import from "@/lib/live"
 * instead of importing call-monitor directly.
 */

/**
 * Create a new live call.
 */
export { createLiveCall };

/**
 * Retrieve live calls.
 */
export {
  getLiveCall,
  getAllLiveCalls,
  getActiveCallCount,
  getCompletedCallCount,
  getFailedCallCount,
};

/**
 * Update live call state.
 */
export {
  updateCallStatus,
  updateAIState,
  updateIntent,
  updateDuration,
  updateTokenUsage,
};

/**
 * Transcript helpers.
 */
export {
  addTranscriptMessage,
};

/**
 * Timeline helpers.
 */
export {
  addEvent,
};

/**
 * Error handling.
 */
export {
  setCallError,
};

/**
 * Cleanup.
 */
export {
  removeLiveCall,
  clearLiveCalls,
};

/**
 * Shared types.
 */
export type {
  LiveCall,
  LiveCallEvent,
  LiveCallStatus,
  TokenUsage,
  TranscriptMessage,
  AIConversationState,
  AIIntent,
};