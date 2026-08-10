"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { createDemoAudioManager, type BrowserDemoAudioManager } from "@/lib/demo/audio/demo-audio-manager";
import { defaultScenario } from "./data";
import { ConversationScheduler } from "./ConversationScheduler";
import { getDemoProgress, getDemoStage } from "./stage";
import { incrementTimer } from "./timer";
import type { DemoContextValue, DemoScenario, DemoState } from "./types";

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>("idle");
  const [scenario, setScenarioState] = useState(defaultScenario);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundNotice, setSoundNotice] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const conversationRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<BrowserDemoAudioManager | null>(null);
  const connectedRef = useRef(false);
  const completedRef = useRef(false);
  const scheduler = useMemo(() => new ConversationScheduler(scenario), [scenario]);
  const isPlaying = state === "playing";
  const isPaused = state === "paused";
  const isCompleted = scheduler.isComplete(currentMessageIndex) && state === "completed";
  const visibleMessages = scheduler.getVisibleMessages(currentMessageIndex);
  const currentMessage = scheduler.getMessage(currentMessageIndex);
  const progress = getDemoProgress(currentMessageIndex, scheduler.totalMessages);
  const stage = getDemoStage(currentMessageIndex, scenario.messages);
  const audio = useCallback(() => (audioRef.current ??= createDemoAudioManager()), []);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (conversationRef.current) clearTimeout(conversationRef.current);
    timerRef.current = null;
    conversationRef.current = null;
  }, []);

  const startDemo = useCallback(() => { clearTimers(); audio().stopAll(); connectedRef.current = false; completedRef.current = false; setSoundNotice(null); setElapsedSeconds(0); setCurrentMessageIndex(0); setState("playing"); }, [clearTimers]);
  const pauseDemo = useCallback(() => { clearTimers(); audioRef.current?.stopAll(); setState("paused"); }, [clearTimers]);
  const resumeDemo = useCallback(() => setState("playing"), []);
  const restartDemo = useCallback(() => { clearTimers(); audioRef.current?.stopAll(); connectedRef.current = false; completedRef.current = false; setElapsedSeconds(0); setCurrentMessageIndex(0); setState("idle"); }, [clearTimers]);
  const stopDemo = useCallback(() => { clearTimers(); audioRef.current?.stopAll(); setElapsedSeconds(0); setCurrentMessageIndex(0); setState("completed"); }, [clearTimers]);
  const completeDemo = useCallback(() => { clearTimers(); audioRef.current?.stopAll(); setState("completed"); }, [clearTimers]);
  const nextMessage = useCallback(() => setCurrentMessageIndex((current) => { const next = scheduler.getNextIndex(current); if (next === null) { setState("completed"); return current; } return next; }), [scheduler]);

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => setElapsedSeconds((seconds) => incrementTimer({ elapsedSeconds: seconds, isRunning: true }).elapsedSeconds), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    let cancelled = false;
    const wait = (milliseconds: number) => new Promise<void>((resolve) => { conversationRef.current = setTimeout(resolve, milliseconds); });
    const runTurn = async () => {
      const step = scheduler.getStep(currentMessageIndex);
      if (!step) return;
      if (currentMessageIndex === 0) { await wait(Math.max(step.delay, 2600)); if (!cancelled) nextMessage(); return; }
      await wait(currentMessageIndex === 1 ? 650 : 220);
      if (cancelled) return;
      if (step.message.speaker !== "system") {
        const spoken = await audio().speak(step.message.text, step.message.speaker);
        if (!spoken && soundEnabled) setSoundNotice("Sound is muted by your browser. Tap Sound On.");
      }
      if (cancelled) return;
      const isLast = step.isLast;
      const next = scheduler.getMessage(currentMessageIndex + 1);
      await wait(isLast ? 500 : pauseFor(step.message.speaker, next?.speaker));
      if (!cancelled) nextMessage();
    };
    void runTurn();
    return () => { cancelled = true; if (conversationRef.current) clearTimeout(conversationRef.current); audioRef.current?.stopAll(); };
  }, [audio, currentMessageIndex, isPlaying, nextMessage, scheduler, soundEnabled]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stage === "ringing") { if (!audio().playRingtone() && soundEnabled) setSoundNotice("Sound is muted by your browser. Tap Sound On."); return; }
    audioRef.current?.stopRingtone();
    if (stage === "connected" && !connectedRef.current) { connectedRef.current = true; if (!audio().playConnectTone() && soundEnabled) setSoundNotice("Sound is muted by your browser. Tap Sound On."); }
  }, [isPlaying, stage, soundEnabled]);

  useEffect(() => {
    if (state !== "completed" || completedRef.current) return;
    completedRef.current = true;
    audioRef.current?.stopAll();
    if (soundEnabled && !audio().playCompletionTone()) setSoundNotice("Sound is muted by your browser. Tap Sound On.");
  }, [state, soundEnabled]);

  useEffect(() => () => { clearTimers(); audioRef.current?.dispose(); }, [clearTimers]);

  const setScenario = useCallback((nextScenario: DemoScenario) => { clearTimers(); audioRef.current?.stopAll(); connectedRef.current = false; completedRef.current = false; setScenarioState(nextScenario); setCurrentMessageIndex(0); setElapsedSeconds(0); setState("idle"); }, [clearTimers]);
  const toggleSound = useCallback(() => { const next = !soundEnabled; setSoundEnabled(next); audio().setMuted(!next); setSoundNotice(next ? null : "Sound is off. The transcript remains visible."); }, [soundEnabled]);

  const value = useMemo<DemoContextValue>(() => ({ state, stage, scenario, currentMessageIndex, currentMessage, visibleMessages, progress, elapsedSeconds, isPlaying, isPaused, isCompleted, soundEnabled, soundNotice, toggleSound, startDemo, pauseDemo, resumeDemo, restartDemo, stopDemo, nextMessage, completeDemo, setScenario }), [state, stage, scenario, currentMessageIndex, currentMessage, visibleMessages, progress, elapsedSeconds, isPlaying, isPaused, isCompleted, soundEnabled, soundNotice, toggleSound, startDemo, pauseDemo, resumeDemo, restartDemo, stopDemo, nextMessage, completeDemo, setScenario]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

function pauseFor(speaker: "ai" | "patient" | "system", next?: "ai" | "patient" | "system") { if (speaker === "ai" && next === "patient") return 900; if (speaker === "patient" && next === "ai") return 800; return 750; }

export function useDemo() { const context = useContext(DemoContext); if (!context) throw new Error("useDemo must be used inside DemoProvider."); return context; }
