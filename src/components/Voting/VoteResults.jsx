import { memo } from 'react';

/**
 * VoteResults — summary display for post-vote results (part of Results page)
 */
const VoteResults = memo(function VoteResults({ players, scores }) {
  return (
    <div>
      {players.map(p => (
        <div
          key={p.id}
          style={{
            display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7,
            padding: '9px 11px', borderRadius: 9, background: 'var(--bg3)',
          }}
        >
          <span style={{ fontSize: 19 }}>{p.avatar}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</div>
            <div style={{
              fontSize: 10,
              color: p.role === 'imposter' ? 'var(--red)' : 'var(--green)',
              fontFamily: "'Space Mono', monospace",
            }}>
              {(p.role || '').toUpperCase()}
            </div>
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: 'var(--blue)' }}>
            +{scores[p.id] || 0}
          </div>
        </div>
      ))}
    </div>
  );
});

export default VoteResults;
