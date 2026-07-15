// components/demo/live/timer.ts

export interface DemoTimer {
  elapsedSeconds: number;
  isRunning: boolean;
}

export function formatElapsedTime(
  elapsedSeconds: number
): string {
  const minutes = Math.floor(elapsedSeconds / 60);

  const seconds = elapsedSeconds % 60;

  return `${minutes
    .toString()
    .padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function incrementTimer(
  timer: DemoTimer
): DemoTimer {
  if (!timer.isRunning) {
    return timer;
  }

  return {
    ...timer,
    elapsedSeconds: timer.elapsedSeconds + 1,
  };
}

export function startTimer(): DemoTimer {
  return {
    elapsedSeconds: 0,
    isRunning: true,
  };
}

export function pauseTimer(
  timer: DemoTimer
): DemoTimer {
  return {
    ...timer,
    isRunning: false,
  };
}

export function resumeTimer(
  timer: DemoTimer
): DemoTimer {
  return {
    ...timer,
    isRunning: true,
  };
}

export function resetTimer(): DemoTimer {
  return {
    elapsedSeconds: 0,
    isRunning: false,
  };
}