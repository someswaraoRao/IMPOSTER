import { useState, useCallback, useMemo, useEffect } from 'react';
import { GameContext } from './GameContext';
import { genCode } from '../utils/roomCode';
import { assignRoles, resolveVotesLogic } from '../utils/gameHelpers';
import { calcScores, calcImposterWin } from '../utils/scoring';
import { CPU_NAMES } from '../data/cpuNames';
import { CPU_AVATARS } from '../data/avatars';

const DEFAULT_PROFILE = null; // Will be fetched from backend

const INITIAL_STATE = {
  myName: '',
  myAvatar: '🕵️',
  myId: 'p0',
  roomCode: '',
  players: [],
  wordPair: null,
  clues: {},
  chat: [],
  votes: {},
  myVote: null,
  round: 1,
  eliminated: [],
  winner: null,
  elimPlayer: null,
  scores: {},
  difficulty: 'random',
  profile: null,
  token: localStorage.getItem('token') || null,
  allWordPairs: [],
  allCpuClues: {},
};

export function GameProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);

  // ── Helpers ──────────────────────────────────────────────
  const updateState = useCallback((patch) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);

  // ── Actions ──────────────────────────────────────────────
  
  useEffect(() => {
    fetch('http://localhost:5000/api/game/words')
      .then(res => res.json())
      .then(data => updateState({ allWordPairs: data }))
      .catch(err => console.error('Failed to load words:', err));
      
    fetch('http://localhost:5000/api/game/cpu-clues')
      .then(res => res.json())
      .then(data => updateState({ allCpuClues: data }))
      .catch(err => console.error('Failed to load cpu clues:', err));

    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
  }, [updateState]);

  const fetchUserProfile = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch user');
      const user = await res.json();
      
      const lbRes = await fetch(`http://localhost:5000/api/leaderboard/profile/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!lbRes.ok) throw new Error('Failed to fetch stats');
      const data = await lbRes.json();
      
      const prof = data.profile;
      updateState({
        profile: {
          id: prof.user_id,
          name: prof.username,
          avatar: '🕵️', // Random or default avatar
          pts: prof.score || 0,
          wins: prof.games_won || 0,
          games: prof.games_played || 0,
          impW: prof.imposter_wins || 0,
          innW: prof.crewmate_wins || 0,
        },
        myName: prof.username,
      });
    } catch (err) {
      console.error(err);
      logoutUser();
    }
  };

  const loginUser = useCallback(async (email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    
    localStorage.setItem('token', data.token);
    updateState({ token: data.token });
    await fetchUserProfile(data.token);
  }, [updateState]);

  const registerUser = useCallback(async (username, email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem('token');
    updateState({ token: null, profile: null, myName: '' });
  }, [updateState]);

  const setMyName   = useCallback((name)   => updateState({ myName: name }), [updateState]);
  const setMyAvatar = useCallback((avatar) => updateState({ myAvatar: avatar }), [updateState]);
  const setDifficulty = useCallback((d) => updateState({ difficulty: d }), [updateState]);

  const createRoom = useCallback((name, avatar) => {
    const roomCode = genCode();
    const me = { id: 'p0', name, avatar, host: true, role: '', cpu: false };
    updateState({
      myName: name,
      myAvatar: avatar,
      myId: 'p0',
      roomCode,
      players: [me],
    });
    return roomCode;
  }, [updateState]);

  const joinRoom = useCallback((name, avatar, code) => {
    const me = { id: 'p0', name, avatar, host: true, role: '', cpu: false };
    updateState({
      myName: name,
      myAvatar: avatar,
      myId: 'p0',
      roomCode: code.toUpperCase(),
      players: [me],
    });
  }, [updateState]);

  const addCpuPlayer = useCallback((index) => {
    setState(prev => {
      if (prev.players.length >= 10) return prev;
      const cpu = {
        id: 'cpu' + index,
        name: CPU_NAMES[index],
        avatar: CPU_AVATARS[index],
        host: false,
        role: '',
        cpu: true,
      };
      return { ...prev, players: [...prev.players, cpu] };
    });
  }, []);

  const startGame = useCallback(() => {
    setState(prev => {
      const scores = { ...prev.scores };
      prev.players.forEach(p => {
        if (scores[p.id] === undefined) scores[p.id] = 0;
      });
      const { wordPair, players } = assignRoles(prev.players, [], prev.difficulty, prev.allWordPairs);
      return {
        ...prev,
        round: 1,
        eliminated: [],
        scores,
        wordPair,
        players,
        clues: {},
        votes: {},
        myVote: null,
        chat: [],
        winner: null,
        elimPlayer: null,
      };
    });
  }, []);

  const submitClue = useCallback((clueText) => {
    setState(prev => ({
      ...prev,
      clues: { ...prev.clues, [prev.myId]: clueText },
    }));
  }, []);

  const addCpuClue = useCallback((playerId, clue) => {
    setState(prev => ({
      ...prev,
      clues: { ...prev.clues, [playerId]: clue },
    }));
  }, []);

  const sendChat = useCallback((text, playerId, avatar, name) => {
    const msg = { pid: playerId, av: avatar, name, text, id: Date.now() + Math.random() };
    setState(prev => ({ ...prev, chat: [...prev.chat, msg] }));
  }, []);

  const castVote = useCallback((targetId) => {
    setState(prev => {
      if (prev.myVote) return prev;
      return {
        ...prev,
        myVote: targetId,
        votes: { ...prev.votes, [prev.myId]: targetId },
      };
    });
  }, []);

  const addCpuVote = useCallback((voterId, targetId) => {
    setState(prev => ({
      ...prev,
      votes: { ...prev.votes, [voterId]: targetId },
    }));
  }, []);

  const resolveVotes = useCallback(() => {
    setState(prev => {
      const active = prev.players.filter(p => !prev.eliminated.includes(p.id));
      const elimId = resolveVotesLogic(prev.votes, active);
      const ep = prev.players.find(p => p.id === elimId);
      const newEliminated = [...prev.eliminated, elimId];

      const { scores, innocentsWon } = calcScores(ep, active, prev.votes, prev.scores);

      let newProfile = { ...prev.profile };
      if (innocentsWon) {
        newProfile = { ...newProfile, innW: newProfile.innW + 1, wins: newProfile.wins + 1, pts: newProfile.pts + 15, games: newProfile.games + 1 };
      }

      return {
        ...prev,
        eliminated: newEliminated,
        elimPlayer: ep,
        winner: innocentsWon ? 'innocent' : null,
        scores,
        myVote: null,
        votes: {},
        profile: newProfile,
      };
    });
  }, []);

  const nextRound = useCallback(() => {
    setState(prev => {
      const remaining = prev.players.filter(p => !prev.eliminated.includes(p.id));
      if (remaining.length <= 2) {
        const imp = prev.players.find(p => p.role === 'imposter');
        const scores = calcImposterWin(imp, prev.scores);
        const newProfile = { ...prev.profile, impW: prev.profile.impW + 1, pts: prev.profile.pts + 20, games: prev.profile.games + 1 };
        return { ...prev, winner: 'imposter', scores, profile: newProfile };
      }

      return {
        ...prev,
        round: prev.round + 1,
        clues: {},
        votes: {},
        myVote: null,
        chat: [],
        winner: null,
        elimPlayer: null,
      };
    });
  }, []);

  const playAgain = useCallback(() => {
    setState(prev => ({
      ...INITIAL_STATE,
      profile: prev.profile,
      myName: prev.myName,
      myAvatar: prev.myAvatar,
      allWordPairs: prev.allWordPairs,
      allCpuClues: prev.allCpuClues,
      roomCode: prev.roomCode,
      players: prev.players.map(p => ({ ...p, role: '' })),
      difficulty: prev.difficulty,
      scores: prev.scores,
    }));
  }, []);

  // ── Memoized value ───────────────────────────────────────
  const value = useMemo(() => ({
    ...state,
    allWordPairs: state.allWordPairs,
    allCpuClues: state.allCpuClues,
    // Actions
    setMyName,
    setMyAvatar,
    setDifficulty,
    createRoom,
    joinRoom,
    addCpuPlayer,
    startGame,
    submitClue,
    addCpuClue,
    sendChat,
    castVote,
    addCpuVote,
    resolveVotes,
    nextRound,
    playAgain,
    loginUser,
    registerUser,
    logoutUser,
  }), [
    state,
    setMyName, setMyAvatar, setDifficulty,
    createRoom, joinRoom, addCpuPlayer,
    startGame, submitClue, addCpuClue,
    sendChat, castVote, addCpuVote,
    resolveVotes, nextRound, playAgain,
    loginUser, registerUser, logoutUser,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
