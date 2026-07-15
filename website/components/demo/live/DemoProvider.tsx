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

  const timerRef =
    useRef<NodeJS.Timeout | null>(null);

  const conversationRef =
    useRef<NodeJS.Timeout | null>(null);

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

    setState("playing");
    setElapsedSeconds(0);
    setCurrentMessageIndex(0);
  }, []);

  const pauseDemo = useCallback(() => {
    clearTimers();
    setState("paused");
  }, []);

  const resumeDemo = useCallback(() => {
    setState("playing");
  }, []);

  const restartDemo = useCallback(() => {
    clearTimers();

    setElapsedSeconds(0);
    setCurrentMessageIndex(0);
    setState("idle");
  }, []);

  const stopDemo = useCallback(() => {
    clearTimers();

    setElapsedSeconds(0);
    setCurrentMessageIndex(0);
    setState("completed");
  }, []);

  const completeDemo = useCallback(() => {
    clearTimers();
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

    conversationRef.current =
      setTimeout(() => {
        nextMessage();
      }, step.delay);

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
    return () => clearTimers();
  }, []);

  const setScenario = useCallback(
    (nextScenario: DemoScenario) => {
      clearTimers();

      setScenarioState(nextScenario);

      setCurrentMessageIndex(0);

      setElapsedSeconds(0);

      setState("idle");
    },
    []
  );

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