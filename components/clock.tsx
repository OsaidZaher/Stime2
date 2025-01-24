"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  startTimer: boolean;
  onReset: () => void;
}

export function Timer({ startTimer, onReset }: TimerProps) {
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

  return (
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto p-8 ">
      <div className="flex items-center">
        {/* Minutes */}
        <div className="flex items-center group">
          <div className="flex flex-col ">
            <button
              onClick={incrementMinutes}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-100 dark:hover:bg-slate-800"
            >
              <ChevronUp className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
            </button>
            <button
              onClick={decrementMinutes}
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
              onClick={incrementSeconds}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-100 dark:hover:bg-slate-800"
            >
              <ChevronUp className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
            </button>
            <button
              onClick={decrementSeconds}
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
          onClick={togglePause}
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
          onClick={resetTimer}
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
  //const [milliseconds, setMilliseconds] = useState(0) //Removed
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

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetStopwatch = () => {
    setMinutes(0);
    setSeconds(0);
    //setMilliseconds(0) //Removed
    setIsRunning(false);
    setIsPaused(false);
    onReset();
  };

  return (
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto p-8">
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

        {/* Removed Milliseconds display */}
        {/* <span className="text-[12rem] font-bold mx-4">.</span>

        {/* Milliseconds */}
        {/* <div className="flex items-center group">
          <span className="text-[12rem] font-bold tabular-nums transition-colors">
            {String(milliseconds).padStart(2, "0")}
          </span>
        </div> */}
      </div>

      {/* Controls */}
      <div className="flex flex-col space-y-6 ml-12 mt-20">
        <button
          onClick={togglePause}
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
          onClick={resetStopwatch}
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
