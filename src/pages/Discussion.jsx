import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import Timer from '../components/common/Timer';
import ChatBox from '../components/Chat/ChatBox';
import { useGame } from '../context/GameContext';
import { useTimer } from '../hooks/useTimer';
import { useChat } from '../hooks/useChat';
import { useCpuChat } from '../hooks/useGameLogic';
import { DISCUSS_TIMER } from '../utils/constants';

export default function Discussion() {
  const navigate = useNavigate();
  const { chat, myId, players, eliminated, sendChat } = useGame();
  const { sendMessage } = useChat();

  const handleTimerEnd = useCallback(() => navigate('/voting'), [navigate]);
  const { value, pct, cls } = useTimer(DISCUSS_TIMER, true, handleTimerEnd);

  // Schedule CPU chat messages
  useCpuChat(true, players, eliminated, sendChat);

  const handleSend = useCallback((text) => {
    sendMessage(text);
  }, [sendMessage]);

  return (
    <div className="screen fade-in">
      <Navbar pill="DISCUSSION" />

      <div className="s-content" style={{ overflow: 'hidden', paddingBottom: 0 }}>
        {/* Timer row */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
            <h2>Discuss</h2>
            <div className={`timer-num${cls ? ' ' + cls : ''}`}>{value}</div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <Timer value={value} pct={pct} cls={cls} showNumber={false} />
          </div>
        </div>

        {/* Chat */}
        <ChatBox messages={chat} myId={myId} onSend={handleSend} />

        <Button
          id="btn-start-voting"
          style={{ flexShrink: 0, marginBottom: 10 }}
          onClick={() => navigate('/voting')}
        >
          🗳️ Start Voting →
        </Button>
      </div>
    </div>
  );
}
