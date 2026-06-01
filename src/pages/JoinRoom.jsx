import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import Button from '../components/common/Button';
import { useGame } from '../context/GameContext';
import { useToast } from '../components/common/Toast';

export default function JoinRoom() {
  const navigate = useNavigate();
  const { myName, myAvatar, joinRoom } = useGame();
  const toast = useToast();

  const [name, setName] = useState(myName);
  const [code, setCode] = useState('');

  const handleJoin = useCallback(() => {
    const trimmedName = name.trim();
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedName) { toast('⚠️ Enter a username'); return; }
    if (!trimmedCode || trimmedCode.length !== 4) { toast('⚠️ Enter a valid 4-letter room code'); return; }
    joinRoom(trimmedName, myAvatar, trimmedCode);
    navigate('/lobby');
  }, [name, code, myAvatar, joinRoom, navigate, toast]);

  return (
    <div className="screen fade-in">
      <Navbar pill="JOIN" />

      <div className="s-content">
        <div className="slide-in">
          <h2>Join Room</h2>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>Enter the room code your friend shared</p>
        </div>

        <div className="card">
          <div className="label" style={{ marginBottom: 9 }}>Your username</div>
          <input
            id="join-username"
            type="text"
            placeholder="Enter username…"
            maxLength={16}
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <div className="label" style={{ marginTop: 14, marginBottom: 9 }}>Room code</div>
          <input
            id="join-code"
            type="text"
            placeholder="e.g. A3X7"
            maxLength={4}
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            style={{ fontSize: 24, textAlign: 'center', letterSpacing: 8, textTransform: 'uppercase' }}
          />
        </div>

        <Button id="btn-join-room" onClick={handleJoin}>🚪 Join Room</Button>
        <Button variant="ghost" onClick={() => navigate('/')}>← Back</Button>
      </div>

      <BottomNav active="join" navigate={navigate} />
    </div>
  );
}
