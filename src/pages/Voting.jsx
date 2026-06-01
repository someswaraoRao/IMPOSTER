import { useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Timer from '../components/common/Timer';
import VoteCard from '../components/Voting/VoteCard';
import { useGame } from '../context/GameContext';
import { useCpuVotes } from '../hooks/useVoting';
import { useTimer } from '../hooks/useTimer';
import { VOTE_TIMER } from '../utils/constants';

export default function Voting() {
  const navigate = useNavigate();
  const { players, eliminated, myId, votes, myVote, castVote, resolveVotes } = useGame();

  const active = useMemo(() => players.filter(p => !eliminated.includes(p.id)), [players, eliminated]);
  const total = Object.keys(votes).length;
  const allDone = total >= active.length;

  const handleTimerEnd = useCallback(() => {
    resolveVotes();
    navigate('/elimination');
  }, [resolveVotes, navigate]);

  const { value, pct, cls } = useTimer(VOTE_TIMER, true, handleTimerEnd);

  // CPU votes
  useCpuVotes(true);

  // Auto-resolve when all votes in
  useEffect(() => {
    if (allDone && active.length > 0) {
      const t = setTimeout(() => {
        resolveVotes();
        navigate('/elimination');
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [allDone, active.length, resolveVotes, navigate]);

  const counts = useMemo(() => {
    const c = {};
    Object.values(votes).forEach(v => (c[v] = (c[v] || 0) + 1));
    return c;
  }, [votes]);

  const handleVote = useCallback((targetId) => {
    if (myVote) return;
    castVote(targetId);
  }, [myVote, castVote]);

  const votableTargets = active.filter(p => p.id !== myId);

  return (
    <div className="screen fade-in">
      <Navbar pill="VOTE" />

      <div className="s-content">
        <div className="slide-in" style={{ textAlign: 'center' }}>
          <h2>Cast Your Vote</h2>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>Who is the imposter? Choose wisely.</p>
        </div>

        {/* Progress + timer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="prog-badge">Votes: {total}/{active.length}</div>
          <div className={`timer-num${cls ? ' ' + cls : ''}`}>{value}</div>
        </div>
        <Timer value={value} pct={pct} cls={cls} showNumber={false} />

        {/* Vote options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {votableTargets.map(p => (
            <VoteCard
              key={p.id}
              player={p}
              picked={myVote === p.id}
              disabled={!!myVote && myVote !== p.id}
              voteCount={allDone ? (counts[p.id] || 0) : 0}
              totalActive={active.length}
              showResults={allDone}
              onVote={handleVote}
            />
          ))}
        </div>

        {/* Waiting indicator */}
        {myVote && !allDone && (
          <div className="card-inset" style={{ textAlign: 'center', fontSize: 13, color: 'var(--text2)' }}>
            Vote locked in! Waiting… ({total}/{active.length})
          </div>
        )}
      </div>
    </div>
  );
}
