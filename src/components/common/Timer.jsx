import { memo } from 'react';

/**
 * Timer — countdown bar + number display
 * value: current seconds
 * pct: fill percentage (0-100)
 * cls: '' | 'warn' | 'crit'
 * showNumber: show large number above bar
 */
const Timer = memo(function Timer({ value, pct, cls, showNumber = true }) {
  return (
    <>
      {showNumber && (
        <div className={`timer-num${cls ? ' ' + cls : ''}`}>{value}</div>
      )}
      <div className="timer-wrap">
        <div
          className={`timer-fill${cls ? ' ' + cls : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </>
  );
});

export default Timer;
