import { memo } from 'react';

/**
 * VoteBar — thin progress bar showing vote percentage
 */
const VoteBar = memo(function VoteBar({ pct, hot }) {
  return (
    <div className="vote-bar">
      <div className={`vb-fill${hot ? ' hot' : ''}`} style={{ width: `${pct}%` }} />
    </div>
  );
});

export default VoteBar;
