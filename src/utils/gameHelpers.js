import { rand } from './random';

/**
 * Assigns roles (imposter / innocent) to active players
 * and selects a word pair based on difficulty.
 * Returns { wordPair, players } with updated roles.
 */
export function assignRoles(players, eliminated, difficulty, wordPairs) {
  let pool = wordPairs;
  if (difficulty !== 'random') {
    pool = wordPairs.filter(w => w.d === difficulty);
  }
  if (!pool || !pool.length) pool = wordPairs;

  const wordPair = rand(pool);
  const active = players.filter(p => !eliminated.includes(p.id));
  const impIdx = Math.floor(Math.random() * active.length);

  const updatedPlayers = players.map(p => {
    const idx = active.findIndex(a => a.id === p.id);
    if (idx === -1) return p; // eliminated, keep as-is
    return { ...p, role: idx === impIdx ? 'imposter' : 'innocent' };
  });

  return { wordPair, players: updatedPlayers };
}

/**
 * Resolves votes: finds the player with the most votes.
 * Returns elimId (string player id).
 */
export function resolveVotesLogic(votes, activePlayers) {
  const counts = {};
  activePlayers.forEach(p => (counts[p.id] = 0));
  Object.values(votes).forEach(v => {
    if (counts[v] !== undefined) counts[v]++;
  });

  let maxV = 0;
  let elimId = null;
  Object.entries(counts).forEach(([id, c]) => {
    if (c > maxV) { maxV = c; elimId = id; }
  });

  if (!elimId) elimId = rand(activePlayers).id;
  return elimId;
}
