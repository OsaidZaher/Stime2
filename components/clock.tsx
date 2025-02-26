"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ChevronUp, ChevronDown, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeComponentProps {
  startTime: boolean;
  onReset: () => void;
  onTimeEnd?: () => void;
  selectedAlarm?: string;
  mode: "timer" | "stopwatch";
}

export function TimeComponent({
  startTime,
  onReset,
  onTimeEnd,
  mode,
}: TimeComponentProps) {
  // Default values based on mode
  const defaultMinutes = mode === "timer" ? 25 : 0;
  const defaultSeconds = 0;

  const [minutes, setMinutes] = useState(defaultMinutes);
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [editingMinutes, setEditingMinutes] = useState(false);
  const [editingSeconds, setEditingSeconds] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(
    String(defaultMinutes).padStart(2, "0")
  );
  const [inputSeconds, setInputSeconds] = useState(
    String(defaultSeconds).padStart(2, "0")
  );

  const minutesInputRef = useRef<HTMLInputElement>(null);
  const secondsInputRef = useRef<HTMLInputElement>(null);

  // Reset to appropriate default values when mode changes
  useEffect(() => {
    setMinutes(mode === "timer" ? 25 : 0);
    setSeconds(0);
    setInputMinutes(String(mode === "timer" ? 25 : 0).padStart(2, "0"));
    setInputSeconds("00");
  }, [mode]);

  // Start time when parent component triggers it
  useEffect(() => {
    if (startTime) {
      setIsRunning(true);
      setIsPaused(false);
      if (!startDateTime) {
        setStartDateTime(new Date());
      }
    } else {
      resetTimeComponent();
    }
  }, [startTime]);

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
            setEndDateTime(new Date());
            clearInterval(interval);
            if (onTimeEnd) onTimeEnd();
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
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, minutes, seconds, mode, onTimeEnd]);

  // Update display strings when the numeric values change
  useEffect(() => {
    setInputMinutes(String(minutes).padStart(2, "0"));
    setInputSeconds(String(seconds).padStart(2, "0"));
  }, [minutes, seconds]);

  // Auto-focus input when editing starts
  useEffect(() => {
    if (editingMinutes && minutesInputRef.current) {
      minutesInputRef.current.focus();
    }
  }, [editingMinutes]);

  useEffect(() => {
    if (editingSeconds && secondsInputRef.current) {
      secondsInputRef.current.focus();
    }
  }, [editingSeconds]);

  const togglePause = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsPaused(!isPaused);
  };

  const incrementMinutes = () => {
    if (mode === "timer" && (!isRunning || isPaused)) {
      setMinutes((prev) => prev + 1);
    }
  };

  const decrementMinutes = () => {
    if (mode === "timer" && (!isRunning || isPaused) && minutes > 0) {
      setMinutes((prev) => prev - 1);
    }
  };

  const incrementSeconds = () => {
    if (mode === "timer" && (!isRunning || isPaused)) {
      if (seconds === 59) {
        setSeconds(0);
        setMinutes((prev) => prev + 1);
      } else {
        setSeconds((prev) => prev + 1);
      }
    }
  };

  const decrementSeconds = () => {
    if (
      mode === "timer" &&
      (!isRunning || isPaused) &&
      (minutes > 0 || seconds > 0)
    ) {
      if (seconds === 0) {
        setSeconds(59);
        setMinutes((prev) => prev - 1);
      } else {
        setSeconds((prev) => prev - 1);
      }
    }
  };

  const resetTimeComponent = () => {
    setMinutes(mode === "timer" ? 25 : 0);
    setSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
    setStartDateTime(null);
    setEndDateTime(null);
    onReset();
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setInputMinutes(value);
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setInputSeconds(value);
    }
  };

  const handleMinutesBlur = () => {
    let newMinutes = parseInt(inputMinutes, 10);
    if (isNaN(newMinutes)) newMinutes = 0;
    // You might want to set an upper limit here, e.g., 99
    newMinutes = Math.min(99, Math.max(0, newMinutes));
    setMinutes(newMinutes);
    setInputMinutes(String(newMinutes).padStart(2, "0"));
    setEditingMinutes(false);
  };

  const handleSecondsBlur = () => {
    let newSeconds = parseInt(inputSeconds, 10);
    if (isNaN(newSeconds)) newSeconds = 0;
    newSeconds = Math.min(59, Math.max(0, newSeconds));
    setSeconds(newSeconds);
    setInputSeconds(String(newSeconds).padStart(2, "0"));
    setEditingSeconds(false);
  };

  const handleMinutesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleMinutesBlur();
    }
  };

  const handleSecondsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSecondsBlur();
    }
  };

  return (
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto p-8">
      <div className="flex items-center">
        {/* Minutes */}
        <div className="flex items-center group">
          {mode === "timer" && (
            <div className="flex flex-col">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  incrementMinutes();
                  e.preventDefault();
                }}
                className="p-2 rounded-lg transition-opacity hover:bg-neutral-100 dark:hover:bg-slate-800"
                disabled={isRunning && !isPaused}
              >
                <ChevronUp className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  decrementMinutes();
                  e.preventDefault();
                }}
                className="p-2 rounded-lg transition-opacity hover:bg-neutral-100 dark:hover:bg-slate-800"
                disabled={isRunning && !isPaused}
              >
                <ChevronDown className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          )}
          {editingMinutes && mode === "timer" && (!isRunning || isPaused) ? (
            <input
              ref={minutesInputRef}
              type="text"
              value={inputMinutes}
              onChange={handleMinutesChange}
              onBlur={handleMinutesBlur}
              onKeyDown={handleMinutesKeyDown}
              className="text-[12rem] font-bold tabular-nums transition-colors w-[16rem] bg-transparent text-center focus:outline-none focus:border-blue-500"
              maxLength={2}
            />
          ) : (
            <span
              className="text-[12rem] font-bold tabular-nums transition-colors cursor-pointer"
              onClick={() => {
                if (mode === "timer" && (!isRunning || isPaused)) {
                  setEditingMinutes(true);
                }
              }}
            >
              {String(minutes).padStart(2, "0")}
            </span>
          )}
        </div>

        <span className="text-[12rem] font-bold mx-4">:</span>

        {/* Seconds */}
        <div className="flex items-center group">
          {editingSeconds && mode === "timer" && (!isRunning || isPaused) ? (
            <input
              ref={secondsInputRef}
              type="text"
              value={inputSeconds}
              onChange={handleSecondsChange}
              onBlur={handleSecondsBlur}
              onKeyDown={handleSecondsKeyDown}
              className="text-[12rem] font-bold tabular-nums transition-colors w-[16rem] bg-transparent text-center focus:outline-none focus:border-blue-500"
              maxLength={2}
            />
          ) : (
            <span
              className="text-[12rem] font-bold tabular-nums transition-colors cursor-pointer"
              onClick={() => {
                if (mode === "timer" && (!isRunning || isPaused)) {
                  setEditingSeconds(true);
                }
              }}
            >
              {String(seconds).padStart(2, "0")}
            </span>
          )}
          {mode === "timer" && (
            <div className="flex flex-col ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  incrementSeconds();
                  e.preventDefault();
                }}
                className="p-2 rounded-lg transition-opacity hover:bg-neutral-100 dark:hover:bg-slate-800"
                disabled={isRunning && !isPaused}
              >
                <ChevronUp className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  decrementSeconds();
                  e.preventDefault();
                }}
                className="p-2 rounded-lg transition-opacity hover:bg-neutral-100 dark:hover:bg-slate-800"
                disabled={isRunning && !isPaused}
              >
                <ChevronDown className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col space-y-6 ml-12 mt-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePause(e);
          }}
          className={cn(
            "p-8 rounded-full transition-all duration-200 ease-in-out",
            "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
            "text-white shadow-lg hover:shadow-xl",
            "transform hover:scale-105 active:scale-95"
          )}
        >
          {isPaused ? <Play size={40} /> : <Pause size={40} />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetTimeComponent();
            e.preventDefault();
          }}
          className={cn(
            "p-8 rounded-full transition-all duration-200 ease-in-out",
            "bg-neutral-200 hover:bg-neutral-300 dark:bg-slate-800 dark:hover:bg-slate-700",
            "text-neutral-700 dark:text-neutral-200 shadow-lg hover:shadow-xl",
            "transform hover:scale-105 active:scale-95"
          )}
        >
          <RotateCcw size={40} />
        </button>
      </div>
    </div>
  );
}
import { Bell, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const alarms = [
  { id: "emi.mp3", name: "Emi" },
  { id: "gta_san_andreas_full.mp3", name: "GTA" },
  { id: "iphone_alarm.mp3", name: "Alarm" },
  { id: "iphone.mp3", name: "Ringtone" },
  { id: "telephone_ring.mp3", name: "Ring 2" },
];

export const useAlarm = (selectedAlarm: string, onAlarmEnd: () => void) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.src = `/sounds/${selectedAlarm}`;
    audio.preload = "auto";
    audio.loop = true;

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
    };

    const handleError = (e: ErrorEvent) => {
      console.error("Error loading audio:", e);
      setIsLoaded(false);
    };

    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("error", handleError);
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
        audio.removeEventListener("error", handleError);
        audio.pause();
        audio.src = "";
        audioRef.current = null;
      }
    };
  }, [selectedAlarm]);

  const playAlarm = async () => {
    if (!audioRef.current || !isLoaded) {
      console.warn("Audio not ready to play");
      return;
    }

    try {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1;
      await audioRef.current.play();
    } catch (error) {
      console.error("Error playing alarm:", error);
    }
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      onAlarmEnd();
    }
  };

  return { playAlarm, stopAlarm, isLoaded };
};

export function AlarmPicker({
  onAlarmSelect,
}: {
  onAlarmSelect: (alarm: string) => void;
}) {
  const [selectedAlarm, setSelectedAlarm] = useState("iphone_alarm.mp3");

  const handleAlarmSelect = (alarmId: string) => {
    setSelectedAlarm(alarmId);
    onAlarmSelect(alarmId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          className="w-40 h-10 bg-white dark:bg-black text-black dark:text-white border-color-200 font-semibold text-sm shadow-md rounded-lg"
        >
          <span className="truncate">
            {alarms.find((a) => a.id === selectedAlarm)?.name || "Pick Alarm"}
          </span>
          <Bell className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36 text-center">
        <DropdownMenuLabel>Select an Alarm</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedAlarm}
          onValueChange={handleAlarmSelect}
        >
          {alarms.map((alarm) => (
            <DropdownMenuRadioItem
              key={alarm.id}
              value={alarm.id}
              className={`flex justify-between items-center h-10 ${
                selectedAlarm === alarm.id ? "bg-accent" : ""
              }`}
            >
              <span className="truncate">{alarm.name}</span>
              {selectedAlarm === alarm.id && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Improved AlarmPopup component
export const AlarmPopup = ({ onStop }: { onStop: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-background rounded-lg shadow-lg p-6 w-80 text-center">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Time's Up!</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onStop}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <p className="text-foreground">Your timer has ended!</p>
        <Button variant="destructive" className="mt-4 w-full" onClick={onStop}>
          Stop Alarm
        </Button>
      </div>
    </div>
  );
};
