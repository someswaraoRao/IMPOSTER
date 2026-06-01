import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useTimer — configurable countdown timer
 *
 * @param {number}   duration  - total seconds to count down
 * @param {boolean}  active    - start/stop the timer
 * @param {Function} onEnd     - callback when timer reaches 0
 *
 * @returns {{ value, pct, cls }} — current second, percentage, CSS class suffix
 */
export function useTimer(duration, active, onEnd) {
  const [value, setValue] = useState(duration);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;

  const reset = useCallback(() => setValue(duration), [duration]);

  useEffect(() => {
    setValue(duration);
  }, [duration]);

  useEffect(() => {
    if (!active) return;

    const id = setInterval(() => {
      setValue(prev => {
        if (prev <= 1) {
          clearInterval(id);
          setTimeout(() => endRef.current?.(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [active]);

  const pct = Math.max(0, (value / duration) * 100);
  const cls = value <= 5 ? 'crit' : value <= 10 ? 'warn' : '';

  return { value, pct, cls, reset };
}
