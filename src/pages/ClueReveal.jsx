import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import { useGame } from '../context/GameContext';

export default function ClueReveal() {
  const navigate = useNavigate();
  const { players, clues, myId } = useGame();
  const entries = Object.entries(clues);
  const me = players.find(p => p.id === myId);
  const isImp = me?.role === 'imposter';

  return (
    <div className="screen fade-in">
      <Navbar pill="CLUE REVEAL" />

      <div className="s-content">
        <div className="slide-in" style={{ textAlign: 'center' }}>
          <h2>All Clues Revealed</h2>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 5, fontWeight: 500 }}>
            Study them carefully — one word doesn't quite fit
          </p>
        </div>

        <div className="card card-glow-blue">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>🕵️</div>
            <div className="label">Clue Board</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {entries.map(([pid, clue], i) => {
              const p = players.find(pl => pl.id === pid);
              return (
                <div
                  key={pid}
                  className="clue-item"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0, fontSize: 15,
                    background: 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(99,102,241,0.15)',
                  }}>
                    {p?.avatar || '👤'}
                  </div>
                  <div className="clue-word">{clue}</div>
                  <div className="clue-who">{p?.name || '?'}</div>
                </div>
              );
            })}
          </div>
        </div>

        {isImp && (
          <div className="card-inset" style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, fontWeight: 500 }}>
            💡 The imposter's clue should feel slightly off — their word is <em style={{ color: 'var(--blue)', fontStyle: 'italic' }}>similar</em> but not the same.
          </div>
        )}

        <Button id="btn-start-discussion" onClick={() => navigate('/discussion')}>
          💬 Start Discussion →
        </Button>
      </div>
    </div>
  );
}
