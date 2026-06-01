import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import { useGame } from '../context/GameContext';

export default function Elimination() {
  const navigate = useNavigate();
  const { elimPlayer, nextRound, winner } = useGame();

  if (!elimPlayer) { navigate('/'); return null; }

  const isImp = elimPlayer.role === 'imposter';

  const handleNext = () => {
    if (isImp) {
      navigate('/results');
    } else {
      nextRound();
      navigate('/word-reveal');
    }
  };

  return (
    <div className="screen fade-in">
      <Navbar pill="ELIMINATED" />

      <div className="s-content" style={{ justifyContent: 'center' }}>
        <div className={`card card-glow-${isImp ? 'red' : 'blue'} elim-card slide-in`}>

          <div className="win-icon" style={{ marginBottom: 16 }}>
            {isImp ? '😱' : '😢'}
          </div>

          {/* Player reveal */}
          <div style={{
            background: isImp
              ? 'linear-gradient(135deg,rgba(254,226,226,0.8),rgba(254,202,202,0.6))'
              : 'linear-gradient(135deg,rgba(209,250,229,0.8),rgba(167,243,208,0.6))',
            border: `1.5px solid ${isImp ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: 18,
            margin: '0 0 20px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', fontSize: 26,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.8)',
              border: '2px solid rgba(255,255,255,0.9)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}>
              {elimPlayer.avatar}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                {elimPlayer.name}
              </div>
              <div style={{
                fontSize: 11, fontWeight: 800,
                color: isImp ? 'var(--red)' : 'var(--green)',
                fontFamily: "'JetBrains Mono', monospace",
                marginTop: 4, letterSpacing: '0.5px',
              }}>
                {isImp ? '😈 WAS THE IMPOSTER' : '😇 WAS INNOCENT'}
              </div>
            </div>
          </div>

          {isImp ? (
            <>
              <div style={{
                fontSize: 28, fontWeight: 900, letterSpacing: '-1px', marginBottom: 6,
                background: 'var(--grad-success)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                INNOCENTS WIN! 🎉
              </div>
              <p style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>
                Justice served. The imposter has been unmasked.
              </p>
            </>
          ) : (
            <>
              <div style={{
                fontSize: 24, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 6,
                background: 'var(--grad-danger)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                WRONG VOTE! 😬
              </div>
              <p style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>
                The imposter is still hiding. Stay sharp next round!
              </p>
            </>
          )}
        </div>

        <Button
          id="btn-elim-next"
          variant={isImp ? 'success' : 'primary'}
          onClick={handleNext}
        >
          {isImp ? '🏆 See Results' : '🔄 Next Round →'}
        </Button>
      </div>
    </div>
  );
}
