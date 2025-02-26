"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the type for our context state
interface TimeContextType {
  // Timer/Stopwatch state
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isPaused: boolean;
  mode: "timer" | "stopwatch";
  startDateTime: Date | null;
  selectedAlarm: string;
  elapsedSeconds: number;
  selectedSubject: number | null;
  topic: string;
  startTime: Date | null;

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
}

// Type for the persistent state in localStorage
interface PersistentTimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isPaused: boolean;
  mode: "timer" | "stopwatch";
  startDateTime: string | null; // Store as ISO string
  selectedAlarm: string;
  initialMinutes: number; // Store initial values for timer reset
  initialSeconds: number;
  lastUpdated: number; // Timestamp to track time between navigations
  // Add form fields to persistent state
  selectedSubject: number | null;
  topic: string;
  startTime: string | null; // Store as ISO string
}

// Create the context with a default undefined value
const TimeContext = createContext<TimeContextType | undefined>(undefined);

// Local storage key
const TIMER_STATE_KEY = "stime_timer_state";

// Custom hook to use the time context
export function useTimeContext() {
  const context = useContext(TimeContext);
  if (context === undefined) {
    throw new Error("useTimeContext must be used within a TimeProvider");
  }
  return context;
}

// Helper to load state from localStorage
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

// Helper to save state to localStorage
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
  const [initialMinutes, setInitialMinutes] = useState(25); // For reset
  const [initialSeconds, setInitialSeconds] = useState(0); // For reset
  const [elapsedSeconds, setElapsedSeconds] = useState(0); // For time tracking
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [topic, setTopic] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedState = loadStateFromStorage();

    if (savedState) {
      // Calculate time elapsed since last update if timer was running
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

      // Load form data from localStorage
      setSelectedSubject(savedState.selectedSubject);
      setTopic(savedState.topic || "");
      setStartTime(
        savedState.startTime ? new Date(savedState.startTime) : null
      );

      // Update timer based on elapsed time if it was running
      if (savedState.isRunning && !savedState.isPaused && timePassed > 0) {
        if (savedState.mode === "timer") {
          // For timer mode, subtract elapsed time
          const totalSeconds = savedState.minutes * 60 + savedState.seconds;
          const remainingSeconds = Math.max(0, totalSeconds - timePassed);
          const newMinutes = Math.floor(remainingSeconds / 60);
          const newSeconds = remainingSeconds % 60;

          setMinutes(newMinutes);
          setSeconds(newSeconds);

          // Check if timer would have completed during navigation
          if (remainingSeconds === 0) {
            setIsRunning(false);
            // You might want to trigger the alarm here
          }
        } else {
          // For stopwatch mode, add elapsed time
          const totalSeconds =
            savedState.minutes * 60 + savedState.seconds + timePassed;
          setMinutes(Math.floor(totalSeconds / 60));
          setSeconds(totalSeconds % 60);
        }
      } else {
        // Just restore the saved state without adjustments
        setMinutes(savedState.minutes);
        setSeconds(savedState.seconds);
      }
    }

    setIsInitialized(true);
  }, []);

  // Save state to localStorage whenever it changes
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
      // Save form data to localStorage
      selectedSubject,
      topic,
      startTime: startTime ? startTime.toISOString() : null,
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
    // Add dependencies for form fields
    selectedSubject,
    topic,
    startTime,
  ]);

  // Timer/Stopwatch logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        if (mode === "timer") {
          // Timer logic (countdown)
          if (seconds > 0) {
            setSeconds(seconds - 1);
          } else if (minutes > 0) {
            setMinutes(minutes - 1);
            setSeconds(59);
          } else {
            setIsRunning(false);
            setIsPaused(false);
            // Timer completion is handled in the component with onTimeEnd
          }
        } else {
          // Stopwatch logic (count up)
          if (seconds < 59) {
            setSeconds(seconds + 1);
          } else {
            setSeconds(0);
            setMinutes(minutes + 1);
          }
        }

        // Update elapsed seconds for tracking purposes
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, minutes, seconds, mode]);

  // Methods to control the timer
  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    if (!startDateTime) {
      setStartDateTime(new Date());
    }
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
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
  };

  const setTimerDuration = (newMinutes: number, newSeconds: number) => {
    setMinutes(newMinutes);
    setSeconds(newSeconds);
    // Also update initial values for reset functionality
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
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
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
