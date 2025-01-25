"use client";

import * as React from "react";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  startTimer: boolean;
  onReset: () => void;
  onTimerEnd: () => void;
  selectedAlarm: string;
}

export function Timer({
  startTimer,
  onReset,
  onTimerEnd,
  selectedAlarm,
}: TimerProps) {
  const [minutes, setMinutes] = useState(20);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [initialMinutes] = useState(20);
  const [initialSeconds] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    if (startTimer) {
      setIsRunning(true);
      setIsPaused(false);
      if (!startTime) {
        setStartTime(new Date());
      }
    } else {
      resetTimer();
    }
  }, [startTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsRunning(false);
          setIsPaused(false);
          setEndTime(new Date());
          clearInterval(interval);
          onTimerEnd();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, minutes, seconds]);

  const togglePause = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsPaused(!isPaused);
  };

  const incrementMinutes = () => {
    if (!isRunning || isPaused) {
      setMinutes((prev) => prev + 1);
    }
  };

  const decrementMinutes = () => {
    if ((!isRunning || isPaused) && minutes > 0) {
      setMinutes((prev) => prev - 1);
    }
  };

  const incrementSeconds = () => {
    if (!isRunning || isPaused) {
      if (seconds === 59) {
        setSeconds(0);
        setMinutes((prev) => prev + 1);
      } else {
        setSeconds((prev) => prev + 1);
      }
    }
  };

  const decrementSeconds = () => {
    if ((!isRunning || isPaused) && (minutes > 0 || seconds > 0)) {
      if (seconds === 0) {
        setSeconds(59);
        setMinutes((prev) => prev - 1);
      } else {
        setSeconds((prev) => prev - 1);
      }
    }
  };

  const resetTimer = () => {
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
    setIsRunning(false);
    setIsPaused(false);
    setStartTime(null);
    setEndTime(null);
    onReset();
  };

  const playAlarm = () => {
    const alarmSound = new Audio(`/sounds/${selectedAlarm}`);
    alarmSound.preload = "auto";
    alarmSound.play().catch((error) => {
      console.error("Error playing alarm:", error);
    });
  };

  return (
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto p-8">
      <div className="flex items-center">
        {/* Minutes */}
        <div className="flex items-center group">
          <div className="flex flex-col ">
            <button
              onClick={(e) => {
                e.stopPropagation;
                incrementMinutes();
                e.preventDefault();
              }}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-100 dark:hover:bg-slate-800"
            >
              <ChevronUp className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation;
                decrementMinutes();
                e.preventDefault();
              }}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-100 dark:hover:bg-slate-800"
            >
              <ChevronDown className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
          <span className="text-[12rem] font-bold tabular-nums transition-colors">
            {String(minutes).padStart(2, "0")}
          </span>
        </div>

        <span className="text-[12rem] font-bold mx-4">:</span>

        {/* Seconds */}
        <div className="flex items-center group">
          <span className="text-[12rem] font-bold tabular-nums transition-colors">
            {String(seconds).padStart(2, "0")}
          </span>
          <div className="flex flex-col ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation;
                incrementSeconds();
                e.preventDefault();
              }}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-100 dark:hover:bg-slate-800"
            >
              <ChevronUp className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation;
                decrementSeconds();
                e.preventDefault();
              }}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-100 dark:hover:bg-slate-800"
            >
              <ChevronDown className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col space-y-6 ml-12 mt-20">
        <button
          onClick={(e) => {
            e.stopPropagation;
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
            resetTimer();
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

interface StopwatchProps {
  startStopwatch: boolean;
  onReset: () => void;
}

export function Stopwatch({ startStopwatch, onReset }: StopwatchProps) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (startStopwatch) {
      setIsRunning(true);
      setIsPaused(false);
    } else {
      resetStopwatch();
    }
  }, [startStopwatch]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        if (seconds < 59) {
          setSeconds(seconds + 1);
        } else {
          setSeconds(0);
          setMinutes(minutes + 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, minutes, seconds]);

  const togglePause = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPaused(!isPaused);
  };

  const resetStopwatch = () => {
    setMinutes(0);
    setSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
    onReset();
  };

  return (
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto p-8 ml-12 ">
      <div className="flex items-center">
        {/* Minutes */}
        <div className="flex items-center group">
          <span className="text-[12rem] font-bold tabular-nums transition-colors">
            {String(minutes).padStart(2, "0")}
          </span>
        </div>

        <span className="text-[12rem] font-bold mx-4">:</span>

        {/* Seconds */}
        <div className="flex items-center group">
          <span className="text-[12rem] font-bold tabular-nums transition-colors">
            {String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col space-y-6  mt-20 mr-12">
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
            resetStopwatch();
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

interface AlarmPickerProps {
  onAlarmSelect: (alarm: string) => void;
}

export function AlarmPicker({ onAlarmSelect }: AlarmPickerProps) {
  const [selectedAlarm, setSelectedAlarm] = React.useState<string | null>(null);

  const handleAlarmSelect = (e: React.MouseEvent, alarmId: string) => {
    e.stopPropagation();
    setSelectedAlarm(alarmId);
    onAlarmSelect(alarmId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          className="w-40 h-10 bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800 font-semibold text-sm shadow-md rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="truncate">
            {selectedAlarm
              ? `${alarms.find((a) => a.id === selectedAlarm)?.name}`
              : "Pick Alarm"}
          </span>
          <Bell className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-36 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuLabel>Select an Alarm</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedAlarm || ""}
          onValueChange={(alarmId) => {
            const event = window.event as MouseEvent;
            event.stopPropagation();
            setSelectedAlarm(alarmId);
            onAlarmSelect(alarmId);
          }}
        >
          {alarms.map((alarm) => (
            <DropdownMenuRadioItem
              key={alarm.id}
              value={alarm.id}
              onClick={(e) => {
                e.stopPropagation();
                handleAlarmSelect(e, alarm.id);
              }}
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

import { X } from "lucide-react";

interface AlarmPopupProps {
  onStop: () => void;
}

export const AlarmPopup: React.FC<AlarmPopupProps> = ({ onStop }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Alarm</h2>
          <button
            onClick={onStop}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p>Your timer has ended!</p>
        <Button
          className="mt-4 bg-red-500 text-white hover:bg-red-600"
          onClick={onStop}
        >
          Stop Alarm
        </Button>
      </div>
    </div>
  );
};
