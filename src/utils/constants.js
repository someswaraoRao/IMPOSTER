// Timer durations (seconds)
export const CLUE_TIMER    = 30;
export const DISCUSS_TIMER = 60;
export const VOTE_TIMER    = 20;

// Scoring values
export const SCORE_INNOCENT_WIN  = 10;
export const SCORE_CORRECT_VOTE  = 5;
export const SCORE_SURVIVE_ROUND = 3;
export const SCORE_IMPOSTER_WIN  = 20;

// CPU timing (ms)
export const CPU_LOBBY_INTERVAL   = 900;
export const CPU_CLUE_MIN_DELAY   = 1800;
export const CPU_CLUE_MAX_DELAY   = 9000;
export const CPU_CHAT_BASE_DELAY  = 2500;
export const CPU_CHAT_STEP_DELAY  = 3500;
export const CPU_VOTE_MIN_DELAY   = 1500;
export const CPU_VOTE_MAX_DELAY   = 6000;

// CPU vote accuracy (0–1): how often an innocent CPU votes correctly
export const CPU_VOTE_ACCURACY    = 0.68;

// Game config
export const MAX_PLAYERS = 10;
export const MIN_PLAYERS = 3;
