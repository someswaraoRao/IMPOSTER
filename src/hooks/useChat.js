import { useGame } from '../context/GameContext';
import { useCallback } from 'react';

/**
 * useChat — wraps sendChat with the current user's identity
 */
export function useChat() {
  const { myId, players, sendChat } = useGame();

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;
    const me = players.find(p => p.id === myId);
    sendChat(text.trim(), myId, me?.avatar || '🕵️', me?.name || 'You');
  }, [myId, players, sendChat]);

  return { sendMessage };
}
