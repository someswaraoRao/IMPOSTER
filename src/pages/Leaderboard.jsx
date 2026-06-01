import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import { useGame } from '../context/GameContext';

const RANK_STYLES = [
  { color: '#f59e0b', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', icon: '🥇' },
  { color: '#9ca3af', bg: 'linear-gradient(135deg,#f3f4f6,#e5e7eb)', icon: '🥈' },
  { color: '#b45309', bg: 'linear-gradient(135deg,#fef3c7,#fcd34d)', icon: '🥉' },
];

const SCORING = [
  ['🏆 Innocent win',   '+10 pts', 'var(--grad-success)'],
  ['😈 Imposter win',   '+20 pts', 'var(--grad-danger)'],
  ['✅ Correct vote',   '+5 pts',  'var(--grad-primary)'],
  ['⚔️ Survived round', '+3 pts',  'linear-gradient(135deg,#8b5cf6,#ec4899)'],
];

const Leaderboard = memo(function Leaderboard() {
  const navigate = useNavigate();
  const { profile } = useGame();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(d => ({
          n: d.username,
          a: '🕵️', // Default avatar
          pts: d.score,
          w: d.games_won,
          g: d.games_played
        }));
        setLeaderboardData(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="screen fade-in">
      <Navbar pill="LEADERBOARD" />

      <div className="s-content">
        <div className="slide-in">
          <h2>Global Rankings</h2>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 5, fontWeight: 500 }}>
            Top detectives &amp; sneakiest imposters
          </p>
        </div>

        {/* Top 3 podium-style */}
        <div className="card">
          <div className="label" style={{ marginBottom: 14 }}>Top Players</div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text2)' }}>Loading...</div>
          ) : leaderboardData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text2)' }}>No players yet!</div>
          ) : leaderboardData.map((p, i) => {
            const rStyle = RANK_STYLES[i];
            return (
              <div key={p.n} className="lb-row" style={i < 3 ? { borderColor: rStyle?.color + '50' } : {}}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: rStyle?.bg || 'var(--bg4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: i < 3 ? 15 : 12, fontWeight: 800,
                  color: rStyle?.color || 'var(--text3)',
                }}>
                  {i < 3 ? rStyle.icon : `#${i + 1}`}
                </div>
                <span style={{ fontSize: 20 }}>{p.a}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{p.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>
                    {p.w}W / {p.g}G
                  </div>
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 800,
                  background: i < 3 ? `linear-gradient(135deg,${rStyle.color},${rStyle.color}aa)` : 'var(--grad-primary)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {p.pts.toLocaleString()}
                </div>
              </div>
            );
          })}

          {/* Current user */}
          {profile && (
            <div className="lb-row me">
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: 'var(--blue)',
              }}>
                -
              </div>
              <span style={{ fontSize: 20 }}>{profile.avatar}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  {profile.name}{' '}
                  <span style={{
                    fontSize: 10, fontWeight: 800, color: 'var(--blue)',
                    background: 'rgba(99,102,241,0.1)', padding: '2px 6px',
                    borderRadius: 6,
                  }}>you</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>
                  {profile.wins}W / {profile.games}G
                </div>
              </div>
              <div className="lb-score">{profile.pts.toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Scoring system */}
        <div className="card">
          <div className="label" style={{ marginBottom: 14 }}>Scoring System</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SCORING.map(([label, value, grad]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.7)', border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>{label}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 800,
                  background: grad,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="leaderboard" navigate={navigate} />
    </div>
  );
});

export default Leaderboard;
