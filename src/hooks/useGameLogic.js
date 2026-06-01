import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { CPU_CHAT_MESSAGES } from '../data/cpuClues';
import { rand, randInt } from '../utils/random';
import {
  CPU_LOBBY_INTERVAL,
  CPU_CLUE_MIN_DELAY,
  CPU_CLUE_MAX_DELAY,
  MAX_PLAYERS,
} from '../utils/constants';

/**
 * useGameLogic — CPU lobby fill
 * Call this in the Lobby page to auto-fill CPU players.
 */
export function useCpuLobbyFill(enabled) {
  const { players, addCpuPlayer } = useGame();
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    if (players.length >= MAX_PLAYERS) return;

    const id = setInterval(() => {
      if (players.length >= MAX_PLAYERS) {
        clearInterval(id);
        return;
      }
      addCpuPlayer(indexRef.current);
      indexRef.current++;
    }, CPU_LOBBY_INTERVAL);

    return () => clearInterval(id);
  }, [enabled, players.length, addCpuPlayer]);
}

/**
 * useCpuClues — Schedule CPU clue submissions
 * Call this in ClueSubmission page.
 */
export function useCpuClues(active, players, eliminated, wordPair, clues, addCpuClue, onAllCluesDone) {
  const { allCpuClues } = useGame();
  const scheduledRef = useRef(false);

  useEffect(() => {
    if (!active || !wordPair || scheduledRef.current) return;
    scheduledRef.current = true;

    const cpuPlayers = players.filter(p => !eliminated.includes(p.id) && p.cpu);

    cpuPlayers.forEach(p => {
      const delay = CPU_CLUE_MIN_DELAY + Math.random() * (CPU_CLUE_MAX_DELAY - CPU_CLUE_MIN_DELAY);
      const timeoutId = setTimeout(() => {
        if (clues[p.id]) return; // already submitted
        const word = p.role === 'imposter' ? wordPair.m : wordPair.i;
        const pool = (allCpuClues && allCpuClues[word]) ? allCpuClues[word] : ['related', 'similar', 'thing'];
        addCpuClue(p.id, rand(pool));
      }, delay);

      return () => clearTimeout(timeoutId);
    });

    return () => { scheduledRef.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}

/**
 * useCpuChat — Schedule CPU chat messages during discussion
 */
export function useCpuChat(active, players, eliminated, sendChat) {
  const scheduledRef = useRef(false);

  useEffect(() => {
    if (!active || scheduledRef.current) return;
    scheduledRef.current = true;

    const cpuPlayers = players.filter(p => !eliminated.includes(p.id) && p.cpu);
    const timeouts = [];

    cpuPlayers.forEach((p, i) => {
      const delay = 2500 + i * 3500 + Math.random() * 2000;
      const id = setTimeout(() => {
        sendChat(rand(CPU_CHAT_MESSAGES), p.id, p.avatar, p.name);
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
