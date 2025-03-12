let timerId = null;
let startTime = null;
let elapsedTime = 0;
let timerMode = "timer"; // 'timer' or 'stopwatch'
let initialDuration = 0; // For timer mode

self.onmessage = function (e) {
  const { command, data } = e.data;

  switch (command) {
    case "start":
      // Start or resume the timer
      startTime = Date.now() - elapsedTime;
      timerMode = data.mode;
      initialDuration = data.initialDuration || 0; // In seconds

      if (timerId === null) {
        // Use a high-precision approach instead of setInterval
        timerId = setInterval(() => {
          const now = Date.now();
          const timePassed = Math.floor((now - startTime) / 1000);

          if (timerMode === "timer") {
            // For countdown timer
            const remaining = Math.max(0, initialDuration - timePassed);
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;

            self.postMessage({
              type: "tick",
              minutes,
              seconds,
              totalSeconds: remaining,
            });

            // Check if timer has reached zero
            if (remaining === 0) {
              self.postMessage({ type: "timerComplete" });
              clearInterval(timerId);
              timerId = null;
            }
          } else {
            // For stopwatch (count up)
            const totalSeconds = timePassed;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            self.postMessage({
              type: "tick",
              minutes,
              seconds,
              totalSeconds,
            });
          }
        }, 100); // Check more frequently than once per second for better accuracy
      }
      break;

    case "pause":
      // Calculate elapsed time precisely when pausing
      if (startTime !== null) {
        elapsedTime = Date.now() - startTime;
      }

      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
      break;

    case "reset":
      // Reset the timer
      elapsedTime = 0;

      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }

      if (timerMode === "timer") {
        self.postMessage({
          type: "tick",
          minutes: Math.floor(initialDuration / 60),
          seconds: initialDuration % 60,
          totalSeconds: initialDuration,
        });
      } else {
        self.postMessage({
          type: "tick",
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
        });
      }
      break;

    case "getState":
      // Return current state
      let currentTime;

      if (startTime !== null && timerId !== null) {
        // Timer is running
        const now = Date.now();
        const timePassed = Math.floor((now - startTime) / 1000);

        if (timerMode === "timer") {
          currentTime = Math.max(0, initialDuration - timePassed);
        } else {
          currentTime = timePassed;
        }
      } else if (elapsedTime > 0) {
        // Timer is paused
        currentTime =
          timerMode === "timer"
            ? Math.max(0, initialDuration - Math.floor(elapsedTime / 1000))
            : Math.floor(elapsedTime / 1000);
      } else {
        // Timer is reset
        currentTime = timerMode === "timer" ? initialDuration : 0;
      }

      const minutes = Math.floor(currentTime / 60);
      const seconds = currentTime % 60;

      self.postMessage({
        type: "state",
        minutes,
        seconds,
        totalSeconds: currentTime,
        isRunning: timerId !== null,
        mode: timerMode,
      });
      break;

    case "setDuration":
      // Set timer duration (for timer mode)
      initialDuration = data.seconds;

      if (timerId === null) {
        // If timer is not running, update the display
        self.postMessage({
          type: "tick",
          minutes: Math.floor(initialDuration / 60),
          seconds: initialDuration % 60,
          totalSeconds: initialDuration,
        });
      }
      break;
  }
};
