import { memo } from 'react';
import PlayerCard from './PlayerCard';
import { MAX_PLAYERS, MIN_PLAYERS } from '../../utils/constants';

/**
 * PlayerGrid — 2-column grid of player slots
 */
const PlayerGrid = memo(function PlayerGrid({ players, myId }) {
  // Show all current players, plus empty slots up to MIN_PLAYERS, 
  // or 1 extra empty slot if we haven't reached MAX_PLAYERS yet.
  let displayCount = Math.max(MIN_PLAYERS, players.length + (players.length < MAX_PLAYERS ? 1 : 0));
  
  const slots = Array.from({ length: displayCount }, (_, i) => players[i] || null);
  return (
    <div className="player-grid">
      {slots.map((p, i) => (
        <PlayerCard key={p?.id ?? `empty-${i}`} player={p} myId={myId} />
      ))}
    </div>
  );
});

export default PlayerGrid;
