import { createContext, useContext } from 'react';

export const GameContext = createContext(null);

/**
 * useGame — consume the GameContext
 * Must be used inside <GameProvider>
 */
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
