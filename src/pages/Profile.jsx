import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import { useGame } from '../context/GameContext';

const ACHIEVEMENTS = (profile) => [
  { ic: '🔍', n: 'Master Detective', d: 'Vote out imposter',      done: profile.innW > 0,  grad: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)' },
  { ic: '🎭', n: 'Sneaky Imposter',  d: 'Win as imposter',        done: profile.impW > 0,  grad: 'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
  { ic: '⭐', n: 'Perfect Round',    d: 'Correct vote first try',  done: profile.wins > 5,  grad: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
  { ic: '🎯', n: 'Vote Predictor',   d: 'Match vote result',       done: false,             grad: 'linear-gradient(135deg,#d1fae5,#a7f3d0)' },
  { ic: '🗝️', n: 'Clue Master',      d: 'Best clue 3 times',       done: profile.wins > 8,  grad: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' },
  { ic: '🔥', n: 'On Fire',          d: 'Win 3 in a row',          done: false,             grad: 'linear-gradient(135deg,#fee2e2,#fecaca)' },
];

const Profile = memo(function Profile() {
  const navigate = useNavigate();
  const { profile } = useGame();
  const p = profile;
  const wr = p ? Math.round((p.wins / Math.max(p.games, 1)) * 100) : 0;
  const achv = p ? ACHIEVEMENTS(p) : [];
  const level = p ? Math.floor(p.wins / 3) + 1 : 1;

  if (!profile) {
    return (
      <div className="screen fade-in">
        <Navbar pill="PROFILE" />
        <div className="s-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ marginBottom: 16 }}>Not Logged In</h2>
          <button className="btn btn-primary" onClick={() => navigate('/auth')}>
            Log In or Sign Up
          </button>
        </div>
        <BottomNav active="profile" navigate={navigate} />
      </div>
    );
  }

  return (
    <div className="screen fade-in">
      <Navbar pill="PROFILE" />

      <div className="s-content">

        {/* Profile card */}
        <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', fontSize: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)',
            border: '3px solid rgba(255,255,255,0.9)',
            margin: '0 auto 14px',
            boxShadow: '0 8px 32px rgba(99,102,241,0.18)',
          }}>
            {p.avatar}
          </div>
          <h2>{p.name}</h2>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 8, padding: '5px 14px', borderRadius: 20,
            background: 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))',
            border: '1px solid rgba(99,102,241,0.2)',
          }}>
            <span style={{ fontSize: 14 }}>⚡</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)' }}>
              Level {level} Detective
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          <div className="stat-box">
            <div className="stat-num">{p.pts.toLocaleString()}</div>
            <div className="stat-label">Total Points</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{p.games}</div>
            <div className="stat-label">Games Played</div>
          </div>
          <div className="stat-box">
            <div className="stat-num" style={{ background: 'var(--grad-success)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {wr}%
            </div>
            <div className="stat-label">Win Rate</div>
          </div>
          <div className="stat-box">
            <div className="stat-num" style={{ background: 'var(--grad-danger)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {p.impW}
            </div>
            <div className="stat-label">Imposter Wins</div>
          </div>
        </div>

        {/* Win split */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            flex: 1,
            background: 'linear-gradient(135deg,rgba(209,250,229,0.8),rgba(167,243,208,0.5))',
            border: '1.5px solid rgba(16,185,129,0.25)',
            borderRadius: 'var(--radius-md)', padding: '16px 12px', textAlign: 'center',
            boxShadow: '0 2px 12px rgba(16,185,129,0.1)',
          }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--green)' }}>{p.innW}</div>
            <div style={{ fontSize: 10, color: 'var(--green)', marginTop: 4, fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, letterSpacing: '0.5px' }}>
              INNOCENT WINS
            </div>
          </div>
          <div style={{
            flex: 1,
            background: 'linear-gradient(135deg,rgba(254,226,226,0.8),rgba(252,165,165,0.5))',
            border: '1.5px solid rgba(239,68,68,0.25)',
            borderRadius: 'var(--radius-md)', padding: '16px 12px', textAlign: 'center',
            boxShadow: '0 2px 12px rgba(239,68,68,0.1)',
          }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--red)' }}>{p.impW}</div>
            <div style={{ fontSize: 10, color: 'var(--red)', marginTop: 4, fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, letterSpacing: '0.5px' }}>
              IMPOSTER WINS
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card">
          <div className="label" style={{ marginBottom: 14 }}>Achievements</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {achv.map(a => (
              <div
                key={a.n}
                style={{
                  background: a.done ? a.grad : 'rgba(255,255,255,0.6)',
                  border: `1.5px solid ${a.done ? 'rgba(99,102,241,0.2)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 12px',
                  textAlign: 'center',
                  boxShadow: a.done ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s',
                  opacity: a.done ? 1 : 0.55,
                }}
              >
                <div style={{
                  fontSize: 26, marginBottom: 6,
                  filter: a.done ? 'none' : 'grayscale(1)',
                }}>
                  {a.ic}
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text)', marginBottom: 3 }}>{a.n}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.4 }}>{a.d}</div>
                {a.done && (
                  <div style={{
                    marginTop: 6, fontSize: 10, fontWeight: 800,
                    color: 'var(--blue)', fontFamily: "'JetBrains Mono',monospace",
                  }}>
                    ✓ UNLOCKED
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="profile" navigate={navigate} />
    </div>
  );
});

export default Profile;
