import { memo } from 'react';

/**
 * PlayerCard — single player slot in the lobby grid
 */
const PlayerCard = memo(function PlayerCard({ player, myId }) {
  if (!player) {
    return (
      <div className="pslot">
        <div className="av"><span className="empty-av">👤</span></div>
        <div className="empty-txt">Waiting…</div>
      </div>
    );
  }

  const slotClass = player.host ? 'host-slot' : '';

  return (
    <div className={`pslot filled ${slotClass}`}>
      <div className="av">{player.avatar}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="pname">
          {player.name}
          {player.id === myId && <span style={{ color: 'var(--blue)' }}> (You)</span>}
        </div>
        <div className="ptag">{player.host ? 'HOST' : 'PLAYER'}</div>
      </div>
      <div className="pdot on" />
    </div>
  );
});

export default PlayerCard;
