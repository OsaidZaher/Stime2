"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";

// Define the type for our context state
interface TimeContextType {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isPaused: boolean;
  mode: "timer" | "stopwatch";
  startDateTime: Date | null;
  selectedAlarm: string;
  elapsedSeconds: number; // accumulated elapsed seconds from previous runs
  selectedSubject: number | null;
  topic: string;
  startTime: Date | null;
  hasTimerEnded: boolean; // Add this new state

  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  setTimerMode: (mode: "timer" | "stopwatch") => void;
  setTimerDuration: (minutes: number, seconds: number) => void;
  setSelectedAlarm: (alarm: string) => void;
  setSelectedSubject: (subject: number | null) => void;
  setTopic: (topic: string) => void;
  setStartTime: (time: Date | null) => void;
  resetTimerEnded: () => void; // Add this new function
}

// Persistent state interface for localStorage
interface PersistentTimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isPaused: boolean;
  mode: "timer" | "stopwatch";
  startDateTime: string | null;
  selectedAlarm: string;
  initialMinutes: number;
  initialSeconds: number;
  lastUpdated: number;
  selectedSubject: number | null;
  topic: string;
  startTime: string | null;
  elapsedSeconds: number;
  hasTimerEnded: boolean; // Add this to persistent state
}

// Create the context
const TimeContext = createContext<TimeContextType | undefined>(undefined);

// Local storage key
const TIMER_STATE_KEY = "stime_timer_state";

export function useTimeContext() {
  const context = useContext(TimeContext);
  if (context === undefined) {
    throw new Error("useTimeContext must be used within a TimeProvider");
  }
  return context;
}

const loadStateFromStorage = (): PersistentTimerState | null => {
  if (typeof window === "undefined") return null;
  try {
    const savedState = localStorage.getItem(TIMER_STATE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Failed to load timer state from localStorage:", error);
  }
  return null;
};

const saveStateToStorage = (state: PersistentTimerState) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      TIMER_STATE_KEY,
      JSON.stringify({
        ...state,
        lastUpdated: Date.now(),
      })
    );
  } catch (error) {
    console.error("Failed to save timer state to localStorage:", error);
  }
};

interface TimeProviderProps {
  children: ReactNode;
}

export function TimeProvider({ children }: TimeProviderProps) {
  // State initialization with default values
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState<"timer" | "stopwatch">("timer");
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [selectedAlarm, setSelectedAlarm] = useState("iphone_alarm.mp3");
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [initialSeconds, setInitialSeconds] = useState(0);
  // accumulated elapsed seconds from previous runs (for pause/resume)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [topic, setTopic] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [hasTimerEnded, setHasTimerEnded] = useState(false); // Add this new state

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = loadStateFromStorage();
    if (savedState) {
      const timeNow = Date.now();
      const timePassed = Math.floor((timeNow - savedState.lastUpdated) / 1000);
      setMode(savedState.mode);
      setSelectedAlarm(savedState.selectedAlarm);
      setInitialMinutes(savedState.initialMinutes);
      setInitialSeconds(savedState.initialSeconds);
      setStartDateTime(
        savedState.startDateTime ? new Date(savedState.startDateTime) : null
      );
      setIsRunning(savedState.isRunning);
      setIsPaused(savedState.isPaused);
      setSelectedSubject(savedState.selectedSubject);
      setTopic(savedState.topic || "");
      setStartTime(
        savedState.startTime ? new Date(savedState.startTime) : null
      );
      setElapsedSeconds(savedState.elapsedSeconds);
      setHasTimerEnded(savedState.hasTimerEnded || false); // Load hasTimerEnded state

      // If the timer was running and not paused, adjust for elapsed time
      if (savedState.isRunning && !savedState.isPaused && timePassed > 0) {
        if (savedState.mode === "timer") {
          const totalSeconds = savedState.minutes * 60 + savedState.seconds;
          const remainingSeconds = Math.max(0, totalSeconds - timePassed);
          setMinutes(Math.floor(remainingSeconds / 60));
          setSeconds(remainingSeconds % 60);
          if (remainingSeconds === 0) {
            setIsRunning(false);
            setHasTimerEnded(true); // Set timer ended state
          }
        } else {
          // For stopwatch, add the passed time
          const totalSeconds =
            savedState.minutes * 60 + savedState.seconds + timePassed;
          setMinutes(Math.floor(totalSeconds / 60));
          setSeconds(totalSeconds % 60);
          setElapsedSeconds(savedState.elapsedSeconds + timePassed);
        }
      } else {
        setMinutes(savedState.minutes);
        setSeconds(savedState.seconds);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    const state: PersistentTimerState = {
      minutes,
      seconds,
      isRunning,
      isPaused,
      mode,
      startDateTime: startDateTime ? startDateTime.toISOString() : null,
      selectedAlarm,
      initialMinutes,
      initialSeconds,
      lastUpdated: Date.now(),
      selectedSubject,
      topic,
      startTime: startTime ? startTime.toISOString() : null,
      elapsedSeconds,
      hasTimerEnded,
    };
    saveStateToStorage(state);
  }, [
    minutes,
    seconds,
    isRunning,
    isPaused,
    mode,
    startDateTime,
    selectedAlarm,
    initialMinutes,
    initialSeconds,
    isInitialized,
    selectedSubject,
    topic,
    startTime,
    elapsedSeconds,
    hasTimerEnded,
  ]);

  // ---- Updated Timer/Stopwatch logic using requestAnimationFrame ----

  // This effect uses requestAnimationFrame to update the displayed time.
  // It calculates elapsed time as the sum of:
  //   • any previously accumulated elapsed seconds (when paused)
  //   • plus the time difference from the current run (if running)
  // For timer mode, it subtracts from the initial duration.
  useEffect(() => {
    let animationFrameId: number;
    const updateTime = () => {
      // Use Date.now() as our reference clock
      const now = Date.now();
      // Calculate seconds elapsed in the current run
      const currentRun = startDateTime
        ? Math.floor((now - startDateTime.getTime()) / 1000)
        : 0;
      const totalElapsed = elapsedSeconds + currentRun;

      if (mode === "timer") {
        const totalInitialSeconds = initialMinutes * 60 + initialSeconds;
        const remaining = totalInitialSeconds - totalElapsed;
        if (remaining <= 0) {
          setMinutes(0);
          setSeconds(0);
          setIsRunning(false);
          setHasTimerEnded(true); // Set timer ended state
          // Do not continue the loop
          return;
        }
        setMinutes(Math.floor(remaining / 60));
        setSeconds(remaining % 60);
      } else {
        // Stopwatch mode: simply count up
        setMinutes(Math.floor(totalElapsed / 60));
        setSeconds(totalElapsed % 60);
      }
      animationFrameId = requestAnimationFrame(updateTime);
    };

    if (isRunning && !isPaused) {
      animationFrameId = requestAnimationFrame(updateTime);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    isRunning,
    isPaused,
    mode,
    startDateTime,
    elapsedSeconds,
    initialMinutes,
    initialSeconds,
  ]);

  // ---- Timer control functions adjustments ----

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    setHasTimerEnded(false); // Reset timer ended state when starting
    // When starting, record the current time as the run's start
    if (!startDateTime) {
      setStartDateTime(new Date());
      // Reset accumulated elapsed time for a fresh start
      setElapsedSeconds(0);
    }
  };

  const pauseTimer = () => {
    if (startDateTime) {
      // Calculate elapsed time from the current run and add it to the accumulated value
      setElapsedSeconds(
        (prev) =>
          prev + Math.floor((Date.now() - startDateTime.getTime()) / 1000)
      );
    }
    setIsPaused(true);
    // Clear startDateTime so that on resume we can re-anchor the current run
    setStartDateTime(null);
  };

  const resumeTimer = () => {
    setIsPaused(false);
    // Restart timing from now without resetting accumulated time
    setStartDateTime(new Date());
  };

  const resetTimer = () => {
    if (mode === "timer") {
      setMinutes(initialMinutes);
      setSeconds(initialSeconds);
    } else {
      setMinutes(0);
      setSeconds(0);
    }
    setIsRunning(false);
    setIsPaused(false);
    setStartDateTime(null);
    setElapsedSeconds(0);
    setHasTimerEnded(false); // Reset timer ended state
  };

  const resetTimerEnded = () => {
    setHasTimerEnded(false);
  };

  const setTimerMode = (newMode: "timer" | "stopwatch") => {
    setMode(newMode);
    // Reset timer when changing modes
    if (newMode === "timer") {
      setMinutes(initialMinutes);
      setSeconds(initialSeconds);
    } else {
      setMinutes(0);
      setSeconds(0);
    }
    setIsRunning(false);
    setIsPaused(false);
    setStartDateTime(null);
    setElapsedSeconds(0);
    setHasTimerEnded(false); // Reset timer ended state
  };

  const setTimerDuration = (newMinutes: number, newSeconds: number) => {
    setMinutes(newMinutes);
    setSeconds(newSeconds);
    setInitialMinutes(newMinutes);
    setInitialSeconds(newSeconds);
  };

  const value = {
    minutes,
    seconds,
    isRunning,
    isPaused,
    mode,
    startDateTime,
    selectedAlarm,
    elapsedSeconds,
    hasTimerEnded, // Expose the new state
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    resetTimerEnded, // Expose the new function
    setTimerMode,
    setTimerDuration,
    setSelectedAlarm,
    selectedSubject,
    topic,
    startTime,
    setSelectedSubject,
    setTopic,
    setStartTime,
  };

  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
}
