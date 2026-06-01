import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import Timer from '../components/common/Timer';
import PlayerStatus from '../components/Player/PlayerStatus';
import { useGame } from '../context/GameContext';
import { useCpuClues } from '../hooks/useGameLogic';
import { useTimer } from '../hooks/useTimer';
import { useToast } from '../components/common/Toast';
import { CLUE_TIMER } from '../utils/constants';

export default function ClueSubmission() {
  const navigate = useNavigate();
  const toast = useToast();
  const { players, myId, eliminated, wordPair, clues, submitClue, addCpuClue } = useGame();

  const [input, setInput] = useState('');
  const done = !!clues[myId];
  const active = players.filter(p => !eliminated.includes(p.id));
  const cnt = Object.keys(clues).length;

  const handleTimerEnd = useCallback(() => {
    navigate('/clue-reveal');
  }, [navigate]);

  const { value, pct, cls } = useTimer(CLUE_TIMER, true, handleTimerEnd);

  // Schedule CPU clues
  useCpuClues(true, players, eliminated, wordPair, clues, addCpuClue, null);

  // Auto-advance when all clues submitted
  useEffect(() => {
    if (cnt >= active.length && active.length > 0) {
      const t = setTimeout(() => navigate('/clue-reveal'), 1200);
      return () => clearTimeout(t);
    }
  }, [cnt, active.length, navigate]);

  const handleSubmit = useCallback(() => {
    const v = input.trim();
    if (!v) { toast('⚠️ Type a clue word'); return; }
    const me = players.find(p => p.id === myId);
    const myWord = (me?.role === 'imposter' ? wordPair?.m : wordPair?.i) || '';
    if (v.toLowerCase() === myWord.toLowerCase()) { toast("⚠️ Can't use your exact secret word!"); return; }
    if (/\s/.test(v)) { toast('⚠️ One word only — no spaces!'); return; }
    submitClue(v);
  }, [input, players, myId, wordPair, submitClue, toast]);

  return (
    <div className="screen fade-in">
      <Navbar pill="CLUE PHASE" />

      <div className="s-content">
        <div className="slide-in" style={{ textAlign: 'center' }}>
          <h2>Submit Your Clue</h2>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>One word that hints at your secret word without revealing it</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="prog-badge">Submitted: {cnt}/{active.length}</div>
          <div className={`timer-num${cls ? ' ' + cls : ''}`}>{value}</div>
        </div>
        <Timer value={value} pct={pct} cls={cls} showNumber={false} />

        {!done ? (
          <div className="card">
            <div className="label" style={{ marginBottom: 9 }}>Your clue word</div>
            <input
              id="clue-input"
              type="text"
              placeholder="One word only…"
              maxLength={24}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <div style={{ marginTop: 7, fontSize: 11, color: 'var(--text3)' }}>
              • One word &nbsp;•&nbsp; Can't be your exact secret word &nbsp;•&nbsp; No spaces
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: 22 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Clue submitted!</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 5 }}>
              Waiting for others ({cnt}/{active.length})
              <br />
              <div className="dots" style={{ marginTop: 6, display: 'inline-flex' }}>
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {!done && <Button id="btn-submit-clue" onClick={handleSubmit}>✅ Submit Clue</Button>}

        <div className="card-inset">
          <div className="label" style={{ marginBottom: 7 }}>Status</div>
          <PlayerStatus players={players} eliminated={eliminated} clues={clues} />
        </div>
      </div>
    </div>
  );
}
