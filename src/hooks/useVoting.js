import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { rand, randInt } from '../utils/random';
import { CPU_VOTE_MIN_DELAY, CPU_VOTE_MAX_DELAY, CPU_VOTE_ACCURACY } from '../utils/constants';

/**
 * useVoting — handles CPU vote scheduling
 * Call this in the Voting page.
 */
export function useCpuVotes(active) {
  const { players, eliminated, votes, addCpuVote } = useGame();
  const scheduledRef = useRef(false);

  useEffect(() => {
    if (!active || scheduledRef.current) return;
    scheduledRef.current = true;

    const activePlayers = players.filter(p => !eliminated.includes(p.id));
    const cpuPlayers = activePlayers.filter(p => p.cpu);
    const timeouts = [];

    cpuPlayers.forEach(p => {
      const delay = CPU_VOTE_MIN_DELAY + Math.random() * (CPU_VOTE_MAX_DELAY - CPU_VOTE_MIN_DELAY);
      const id = setTimeout(() => {
        if (votes[p.id]) return;
        const others = activePlayers.filter(o => o.id !== p.id);
        let target;
        if (p.role === 'imposter') {
          const innocents = others.filter(o => o.role !== 'imposter');
          target = rand(innocents.length ? innocents : others);
        } else {
          const imp = others.find(o => o.role === 'imposter');
          const nonImposters = others.filter(o => o.role !== 'imposter' && o.id !== p.id);
          target = Math.random() < CPU_VOTE_ACCURACY
            ? imp
            : rand(nonImposters.length ? nonImposters : others);
        }
        if (target) addCpuVote(p.id, target.id);
      }, delay);
      timeouts.push(id);
    });

    return () => {
      timeouts.forEach(id => clearTimeout(id));
      scheduledRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
