import { memo } from 'react';

/**
 * PlayerStatus — inline submission status badges during clue phase
 */
const PlayerStatus = memo(function PlayerStatus({ players, eliminated, clues }) {
  const active = players.filter(p => !eliminated.includes(p.id));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {active.map(p => {
        const done = !!clues[p.id];
        return (
          <div
            key={p.id}
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: `1.5px solid ${done ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: done ? '0 2px 12px rgba(99,102,241,0.1)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--text2)', marginBottom: 4 }}>
              <span style={{ fontSize: 14 }}>{p.avatar}</span> {p.name}
            </div>
            <div style={{
              fontSize: 14,
              fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
              color: done ? 'var(--blue)' : 'var(--text4)',
              minHeight: '20px'
            }}>
              {done ? clues[p.id] : 'thinking...'}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default PlayerStatus;
