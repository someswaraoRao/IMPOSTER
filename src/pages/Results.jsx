import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import VoteResults from '../components/Voting/VoteResults';
import { useGame } from '../context/GameContext';
import { useConfetti } from '../hooks/useConfetti';

export default function Results() {
  const navigate = useNavigate();
  const { winner, wordPair, players, scores, myId, round, clues, playAgain } = useGame();
  const { fireConfetti } = useConfetti();

  const isImpW   = winner === 'imposter';
  const imposter = players.find(p => p.role === 'imposter');
  const myPts    = scores[myId] || 0;

  useEffect(() => {
    if (!isImpW) fireConfetti();
  }, [isImpW, fireConfetti]);

  const handlePlayAgain = () => {
    playAgain();
    navigate('/lobby');
  };

  return (
    <div className="screen fade-in">
      <Navbar pill="RESULTS" />

      <div className="s-content" style={{ alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '540px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Winner banner */}
        <div style={{
          textAlign: 'center', padding: '16px 0 8px',
          background: isImpW
            ? 'linear-gradient(135deg,rgba(254,226,226,0.6),rgba(254,243,199,0.6))'
            : 'linear-gradient(135deg,rgba(209,250,229,0.6),rgba(186,230,253,0.6))',
          borderRadius: 'var(--radius-xl)',
          border: `1.5px solid ${isImpW ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
          boxShadow: 'var(--shadow-card)',
        }} className="slide-in">
          <div className="win-icon">{isImpW ? '😈' : '🎉'}</div>
          <div className={`win-title ${isImpW ? 'win-imp' : 'win-inn'}`}>
            {isImpW ? 'IMPOSTER WINS!' : 'INNOCENTS WIN!'}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 6, marginBottom: 16, fontWeight: 500 }}>
            {isImpW
              ? `${imposter?.name} fooled everyone and survived!`
              : 'The imposter has been caught!'
            }
          </p>
        </div>

        {/* Secret words */}
        <div className="card">
          <div className="label" style={{ marginBottom: 14 }}>🔍 The Secret Words</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{
              background: 'linear-gradient(135deg,rgba(209,250,229,0.7),rgba(167,243,208,0.5))',
              border: '1.5px solid rgba(16,185,129,0.25)',
              borderRadius: 'var(--radius-md)', padding: 16, textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: 'var(--green)', marginBottom: 6, fontWeight: 800, letterSpacing: '1px' }}>INNOCENTS</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)' }}>{wordPair?.i}</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg,rgba(254,226,226,0.7),rgba(252,165,165,0.4))',
              border: '1.5px solid rgba(239,68,68,0.25)',
              borderRadius: 'var(--radius-md)', padding: 16, textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: 'var(--red)', marginBottom: 6, fontWeight: 800, letterSpacing: '1px' }}>IMPOSTER</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)' }}>{wordPair?.m}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          <div className="stat-box">
            <div className="stat-num" style={{
              background: isImpW ? 'var(--grad-danger)' : 'var(--grad-success)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>+{myPts}</div>
            <div className="stat-label">Your Points</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{round}</div>
            <div className="stat-label">Rounds</div>
          </div>
          <div className="stat-box">
            <div className="stat-num" style={{ fontSize: 22 }}>{imposter?.avatar || '?'}</div>
            <div className="stat-label">Imposter</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{Object.keys(clues).length}</div>
            <div className="stat-label">Clues</div>
          </div>
        </div>

        {/* Final roles */}
        <div className="card">
          <div className="label" style={{ marginBottom: 12 }}>Final Roles</div>
          <VoteResults players={players} scores={scores} />
        </div>

        <Button id="btn-play-again" onClick={handlePlayAgain}>🎮 Play Again</Button>
        <Button variant="ghost" onClick={() => navigate('/')}>🏠 Main Menu</Button>
        </div>
      </div>
    </div>
  );
}
