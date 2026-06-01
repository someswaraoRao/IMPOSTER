import { memo } from 'react';
import VoteBar from './VoteBar';

/**
 * VoteCard — clickable vote button for a single player
 */
const VoteCard = memo(function VoteCard({ player, picked, disabled, voteCount, totalActive, showResults, onVote }) {
  const pct = showResults ? Math.round((voteCount / totalActive) * 100) : 0;
  const hot = voteCount > 1;

  return (
    <button
      className={`vote-opt${picked ? ' picked' : ''}`}
      onClick={() => onVote(player.id)}
      disabled={disabled}
      id={`vote-${player.id}`}
    >
      <div className="av" style={{ width: 38, height: 38, fontSize: 19 }}>{player.avatar}</div>
      <div style={{ flex: 1 }}>
        <div className="vote-name">{player.name}</div>
        {showResults && <VoteBar pct={pct} hot={hot} />}
      </div>
      {showResults && <div className="vote-count">{voteCount}v</div>}
    </button>
  );
});

export default VoteCard;
