import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import { useGame } from '../context/GameContext';

const HOW_TO = [
  ['🤫', 'Get your secret word',    "Three players share one word. The imposter gets a similar but different word."],
  ['💬', 'Give one clue',           "Submit a single word clue. Don't reveal your word — or expose yourself!"],
  ['🗣️', 'Debate & discuss',        "Analyze everyone's clues and argue your case in group chat."],
  ['🗳️', 'Vote someone out',         "Majority wins. Catch the imposter — or let them fool you."],
];

const ICON_BG = [
  'linear-gradient(135deg,#e0e7ff,#c7d2fe)',
  'linear-gradient(135deg,#fce7f3,#fbcfe8)',
  'linear-gradient(135deg,#d1fae5,#a7f3d0)',
  'linear-gradient(135deg,#fef3c7,#fde68a)',
];

const LandingPage = memo(function LandingPage() {
  const navigate = useNavigate();
  const { profile, logoutUser } = useGame();

  return (
    <div className="screen fade-in">
      <Navbar />

      <div className="s-content" style={{ justifyContent: 'center' }}>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', padding: '16px 0 8px' }} className="slide-in">
          <div style={{
            width: 90, height: 90, borderRadius: '50%', margin: '0 auto 16px',
            background: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, boxShadow: '0 8px 32px rgba(99,102,241,0.2)',
            border: '3px solid rgba(255,255,255,0.9)',
          }}>
            🕵️
          </div>
          <h1 style={{ fontSize: 36, marginBottom: 8, lineHeight: 1.1 }}>
            Imposter<span style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Hunt</span>
          </h1>
          <p style={{
            fontSize: 14, color: 'var(--text2)',
            maxWidth: 290, margin: '0 auto 28px', lineHeight: 1.7, fontWeight: 500,
          }}>
            The social deduction word game. Find the imposter — or become one.
          </p>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!profile ? (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/auth')}
              style={{ fontSize: 15, padding: '16px 20px' }}
            >
              🔐 Login / Register
            </button>
          ) : (
            <>
              <button
                id="btn-create"
                className="btn btn-primary"
                onClick={() => navigate('/create')}
                style={{ fontSize: 15, padding: '16px 20px' }}
              >
                🎮 Create Room
              </button>
              <button
                id="btn-join"
                className="btn btn-ghost"
                onClick={() => navigate('/join')}
                style={{ fontSize: 15, padding: '16px 20px' }}
              >
                🚪 Join with Code
              </button>
              <button
                className="btn btn-ghost"
                onClick={logoutUser}
                style={{ fontSize: 15, padding: '16px 20px', color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>

        {/* How to Play */}
        <div className="card card-glow-blue slide-in" style={{ animationDelay: '.12s' }}>
          <div className="label" style={{ marginBottom: 16 }}>How to play</div>
          {HOW_TO.map(([ic, title, desc], idx) => (
            <div key={title} style={{ display: 'flex', gap: 13, alignItems: 'flex-start', marginBottom: idx < HOW_TO.length - 1 ? 14 : 0 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: ICON_BG[idx],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, boxShadow: '0 2px 8px rgba(99,102,241,0.1)',
              }}>
                {ic}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, color: 'var(--text)' }}>{title}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="stat-grid">
          {[
            { num: '3-10', label: 'Players', grad: 'var(--grad-primary)' },
            { num: '30s', label: 'Clue Timer', grad: 'var(--grad-primary)' },
            { num: '3', label: 'Difficulty Tiers', grad: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
            { num: '20s', label: 'Vote Timer', grad: 'linear-gradient(135deg,#f59e0b,#f97316)' },
          ].map(({ num, label, grad }) => (
            <div key={label} className="stat-box">
              <div className="stat-num" style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{num}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

      </div>

      <BottomNav active="landing" navigate={navigate} />
    </div>
  );
});

export default LandingPage;
