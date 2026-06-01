import {
  SCORE_INNOCENT_WIN,
  SCORE_CORRECT_VOTE,
  SCORE_SURVIVE_ROUND,
  SCORE_IMPOSTER_WIN,
} from './constants';

/**
 * Calculate scores after elimination.
 * Returns updated scores object and whether innocents won.
 */
export function calcScores(elimPlayer, activePlayers, votes, currentScores) {
  const scores = { ...currentScores };
  const innocentsWon = elimPlayer.role === 'imposter';

  if (innocentsWon) {
    // Innocent players get win points
    activePlayers
      .filter(p => p.role === 'innocent')
      .forEach(p => { scores[p.id] = (scores[p.id] || 0) + SCORE_INNOCENT_WIN; });

    // Players who voted correctly get bonus
    activePlayers
      .filter(p => votes[p.id] === elimPlayer.id)
      .forEach(p => { scores[p.id] = (scores[p.id] || 0) + SCORE_CORRECT_VOTE; });
  } else {
    // Wrong vote — surviving innocents get survival points
    activePlayers
      .filter(p => p.role === 'innocent' && p.id !== elimPlayer.id)
      .forEach(p => { scores[p.id] = (scores[p.id] || 0) + SCORE_SURVIVE_ROUND; });
  }

  return { scores, innocentsWon };
}

/**
 * Calculate imposter win bonus score.
 */
export function calcImposterWin(imposter, currentScores) {
  const scores = { ...currentScores };
  if (imposter) {
    scores[imposter.id] = (scores[imposter.id] || 0) + SCORE_IMPOSTER_WIN;
  }
  return scores;
}
