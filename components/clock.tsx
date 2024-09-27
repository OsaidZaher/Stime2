import React, { useState, useEffect } from "react";

export function Stopwatch() {
  const [minutes, setMinutes] = useState(20);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((seconds) => {
          if (seconds > 0) {
            return seconds - 1;
          } else if (minutes > 0) {
            setMinutes((minutes) => minutes - 1);
            return 59;
          } else {
            setIsRunning(false);
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [minutes, seconds, isRunning]);

  return (
    <div>
      <h1>
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </h1>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Start"}
      </button>
    </div>
  );
}

export function Timer() {
  const [minutes, setMinutes] = useState(20);
  const [second, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(null);

  return <></>;
}
