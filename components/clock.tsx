"use client";
import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Play, Pause, RotateCcw } from "lucide-react";

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

  const togglePause = () => {
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
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <div className="flex flex-col">
          <button onClick={incrementMinutes} className="p-1">
            <ChevronUp size={15} />
          </button>
          <button onClick={decrementMinutes} className="p-1">
            <ChevronDown size={15} />
          </button>
        </div>
        <span className="text-7xl font-bold mx-1">
          {String(minutes).padStart(2, "0")}
        </span>
      </div>
      <span className="text-7xl font-bold">:</span>
      <div className="flex items-center">
        <span className="text-7xl font-bold mx-1">
          {String(seconds).padStart(2, "0")}
        </span>
        <div className="flex flex-col">
          <button onClick={incrementSeconds} className="p-1">
            <ChevronUp size={15} />
          </button>
          <button onClick={decrementSeconds} className="p-1">
            <ChevronDown size={15} />
          </button>
        </div>
      </div>
      <button
        onClick={togglePause}
        className="p-2 bg-blue-500 text-white rounded-full"
      >
        {isPaused ? <Play size={50} /> : <Pause size={50} />}
      </button>
      <button
        onClick={resetTimer}
        className="p-2 bg-gray-500 text-white rounded-full"
      >
        <RotateCcw size={50} />
      </button>
    </div>
  );
}
