"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { defaultScenario } from "./data";
import { ConversationScheduler } from "./ConversationScheduler";
import { getDemoProgress, getDemoStage } from "./stage";
import { incrementTimer } from "./timer";
import { createDemoAudioManager, type BrowserDemoAudioManager } from "@/lib/demo/audio/demo-audio-manager";
import type {
  DemoContextValue,
  DemoScenario,
  DemoState,
} from "./types";

const DemoContext =
  createContext<DemoContextValue | null>(null);

interface DemoProviderProps {
  children: ReactNode;
}

export function DemoProvider({
  children,
}: DemoProviderProps) {
  const [state, setState] =
    useState<DemoState>("idle");

  const [scenario, setScenarioState] =
    useState(defaultScenario);

  const scheduler = useMemo(
    () => new ConversationScheduler(scenario),
    [scenario]
  );

  const [currentMessageIndex, setCurrentMessageIndex] =
    useState(0);

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundNotice, setSoundNotice] = useState<string | null>(null);

  const timerRef =
    useRef<NodeJS.Timeout | null>(null);

  const conversationRef =
    useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<BrowserDemoAudioManager | null>(null);
  const connectedRef = useRef(false);
  const completedRef = useRef(false);

  const audio = () => (audioRef.current ??= createDemoAudioManager());

  const isPlaying = state === "playing";

  const isPaused = state === "paused";

  const isCompleted =
    scheduler.isComplete(currentMessageIndex) &&
    state === "completed";

  const visibleMessages =
    scheduler.getVisibleMessages(
      currentMessageIndex
    );

  const currentMessage =
    scheduler.getMessage(
      currentMessageIndex
    );

  const progress =
    getDemoProgress(
      currentMessageIndex,
      scheduler.totalMessages
    );

  const stage =
    getDemoStage(
      currentMessageIndex,
      scenario.messages
    );

  const clearTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (conversationRef.current) {
      clearTimeout(conversationRef.current);
      conversationRef.current = null;
    }
  };

  const startDemo = useCallback(() => {
    clearTimers();
    audio().stopAll();
    connectedRef.current = false;
    completedRef.current = false;
    setState("playing");
    setElapsedSeconds(0);
    setCurrentMessageIndex(0);
  }, []);

  const pauseDemo = useCallback(() => {
    clearTimers();
    audioRef.current?.stopAll();
    setState("paused");
  }, []);

  const resumeDemo = useCallback(() => {
    setState("playing");
  }, []);

  const restartDemo = useCallback(() => {
    clearTimers();
    audioRef.current?.stopAll();
    connectedRef.current = false;
    completedRef.current = false;

    setElapsedSeconds(0);
    setCurrentMessageIndex(0);
    setState("idle");
  }, []);

  const stopDemo = useCallback(() => {
    clearTimers();
    audioRef.current?.stopAll();

    setElapsedSeconds(0);
    setCurrentMessageIndex(0);
    setState("completed");
  }, []);

  const completeDemo = useCallback(() => {
    clearTimers();
    audioRef.current?.stopAll();
    setState("completed");
  }, []);

  const nextMessage = useCallback(() => {
    setCurrentMessageIndex((current) => {
      const next =
        scheduler.getNextIndex(current);

      if (next === null) {
        setState("completed");
        return current;
      }

      return next;
    });
  }, [scheduler]);

  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setElapsedSeconds((seconds) =>
        incrementTimer({
          elapsedSeconds: seconds,
          isRunning: true,
        }).elapsedSeconds
      );
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const step =
      scheduler.getStep(currentMessageIndex);

    if (!step) return;

    const delay = currentMessageIndex === 0 ? Math.max(step.delay, 2600) : step.delay;
    conversationRef.current =
      setTimeout(() => {
        nextMessage();
      }, delay);

    return () => {
      if (conversationRef.current) {
        clearTimeout(conversationRef.current);
      }
    };
  }, [
    isPlaying,
    currentMessageIndex,
    scheduler,
    nextMessage,
  ]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stage === "ringing") {
      if (!audio().playRingtone() && soundEnabled) setSoundNotice("Sound is muted by your browser. Tap Sound On.");
      return;
    }
    audioRef.current?.stopRingtone();
    if (stage === "connected" && !connectedRef.current) {
      connectedRef.current = true;
      if (!audio().playConnectTone() && soundEnabled) setSoundNotice("Sound is muted by your browser. Tap Sound On.");
    }
  }, [isPlaying, stage, soundEnabled]);

  useEffect(() => {
    if (!isPlaying || !currentMessage || currentMessage.speaker === "system") return;
    const spoken = audio().speak(currentMessage.text, currentMessage.speaker);
    if (!spoken && soundEnabled) setSoundNotice("Sound is muted by your browser. Tap Sound On.");
  }, [currentMessage, isPlaying, soundEnabled]);

  useEffect(() => {
    if (state !== "completed" || completedRef.current) return;
    completedRef.current = true;
    audioRef.current?.stopAll();
    if (soundEnabled && !audio().playCompletionTone()) setSoundNotice("Sound is muted by your browser. Tap Sound On.");
  }, [state, soundEnabled]);

  useEffect(() => () => { clearTimers(); audioRef.current?.dispose(); }, []);

  const setScenario = useCallback(
    (nextScenario: DemoScenario) => {
      clearTimers();
      audioRef.current?.stopAll();
      connectedRef.current = false;
      completedRef.current = false;

      setScenarioState(nextScenario);

      setCurrentMessageIndex(0);

      setElapsedSeconds(0);

      setState("idle");
    },
    []
  );

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audio().setMuted(!next);
    setSoundNotice(next ? null : "Sound is off. The transcript remains visible.");
  }, [soundEnabled]);

  const value = useMemo<DemoContextValue>(
    () => ({
      state,

      stage,

      scenario,

      currentMessageIndex,

      currentMessage,

      visibleMessages,

      progress,

      elapsedSeconds,

      isPlaying,

      isPaused,

      isCompleted,

      soundEnabled,

      soundNotice,

      toggleSound,

      startDemo,

      pauseDemo,

      resumeDemo,

      restartDemo,

      stopDemo,

      nextMessage,

      completeDemo,

      setScenario,
    }),
    [
      state,
      stage,
      scenario,
      currentMessageIndex,
      currentMessage,
      visibleMessages,
      progress,
      elapsedSeconds,
      isPlaying,
      isPaused,
      isCompleted,
      soundEnabled,
      soundNotice,
      toggleSound,
      startDemo,
      pauseDemo,
      resumeDemo,
      restartDemo,
      stopDemo,
      nextMessage,
      completeDemo,
      setScenario,
    ]
  );

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context =
    useContext(DemoContext);

  if (!context) {
    throw new Error(
      "useDemo must be used inside DemoProvider."
    );
  }

  return context;
}
