import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import { useGame } from '../context/GameContext';

export default function WordReveal() {
  const navigate = useNavigate();
  const { players, myId, wordPair, round } = useGame();
  const wordRef = useRef(null);

  const me = players.find(p => p.id === myId);
  const isImp = me?.role === 'imposter';
  const word = isImp ? wordPair?.m : wordPair?.i;
  const hint = isImp
    ? '⚠️ You are the imposter. Blend in — the innocents have a different word!'
    : null;

  useEffect(() => {
    const t = setTimeout(() => {
      if (wordRef.current) wordRef.current.style.opacity = '1';
    }, 80);
    return () => clearTimeout(t);
  }, []);

  if (!wordPair) { navigate('/'); return null; }

  return (
    <div className="screen fade-in">
      <Navbar pill={`ROUND ${round}`} />

      <div className="s-content" style={{ justifyContent: 'center' }}>

        <div style={{ textAlign: 'center' }} className="slide-in">
          <h2>Your Secret Word</h2>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 5, fontWeight: 500 }}>
            Memorize it — and guard it carefully
          </p>
        </div>

        {/* Word hero card */}
        <div className={`card word-hero card-glow-${isImp ? 'red' : 'blue'}${isImp ? ' imp-bg' : ''}`}>
          {/* Role badge */}
          <div className={`role-tag ${isImp ? 'imp' : 'inn'}`} style={{ fontSize: 12 }}>
            {isImp ? '😈 IMPOSTER' : '😇 INNOCENT'}
          </div>

          {/* Word */}
          <div
            ref={wordRef}
            className={`word-display${isImp ? ' imp-word' : ''}`}
            style={{ opacity: 0, transition: 'opacity 0.7s ease' }}
          >
            {word}
          </div>

          {/* Difficulty */}
          <div style={{ marginTop: 10 }}>
            <span className={`diff-tag diff-${wordPair.d}`}>{wordPair.d}</span>
          </div>
        </div>

        {/* Hint */}
        {hint && (
          <div className="card-inset" style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, fontWeight: 500 }}>
            {hint}
          </div>
        )}

        <Button id="btn-go-clue" onClick={() => navigate('/clue-submit')}>
          ✍️ Got it — Submit my clue →
        </Button>
      </div>
    </div>
  );
}
