// src/auth/hooks/useOTPTimer.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Returns { seconds, isExpired, start, reset }
 * Call start() when OTP is sent; reset() to clear.
 */
export function useOTPTimer(initialSeconds = 30) {
  const [seconds,   setSeconds]   = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    stop();
    setSeconds(initialSeconds);
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          stop();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [initialSeconds, stop]);

  const reset = useCallback(() => {
    stop();
    setSeconds(0);
  }, [stop]);

  // cleanup on unmount
  useEffect(() => () => stop(), [stop]);

  return {
    seconds,
    isExpired: !isRunning && seconds === 0,
    isRunning,
    start,
    reset,
  };
}