import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import AvatarPicker from '../components/Player/AvatarPicker';
import Button from '../components/common/Button';
import { useGame } from '../context/GameContext';
import { useToast } from '../components/common/Toast';

const DIFFICULTIES = ['random', 'easy', 'medium', 'hard'];
const DIFF_META = {
  random: { label: '🎲 Random', grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
  easy:   { label: '🟢 Easy',   grad: 'linear-gradient(135deg,#10b981,#06b6d4)' },
  medium: { label: '🟡 Medium', grad: 'linear-gradient(135deg,#f59e0b,#f97316)' },
  hard:   { label: '🔴 Hard',   grad: 'linear-gradient(135deg,#ef4444,#ec4899)' },
};

export default function CreateRoom() {
  const navigate = useNavigate();
  const { myName, myAvatar, difficulty, setMyAvatar, setDifficulty, createRoom } = useGame();
  const toast = useToast();
  const [name, setName] = useState(myName);

  const handleCreate = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) { toast('⚠️ Enter a username'); return; }
    createRoom(trimmed, myAvatar);
    navigate('/lobby');
  }, [name, myAvatar, createRoom, navigate, toast]);

  return (
    <div className="screen fade-in">
      <Navbar pill="CREATE" />

      <div className="s-content">
        <div className="slide-in">
          <h2>Create Room</h2>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 5, fontWeight: 500 }}>
            Set your username and invite friends
          </p>
        </div>

        <div className="card">
          {/* Username */}
          <div className="label" style={{ marginBottom: 9 }}>Your username</div>
          <input
            id="create-username"
            type="text"
            placeholder="Enter username…"
            maxLength={16}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />

          {/* Avatar */}
          <div className="label" style={{ marginTop: 18, marginBottom: 10 }}>Choose avatar</div>
          <AvatarPicker selected={myAvatar} onSelect={setMyAvatar} />

          {/* Difficulty */}
          <div className="label" style={{ marginTop: 18, marginBottom: 10 }}>Difficulty</div>
          <div style={{ display: 'flex', gap: 7 }}>
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                className={`btn-sm${difficulty === d ? ' sel' : ''}`}
                onClick={() => setDifficulty(d)}
                style={difficulty === d ? { background: DIFF_META[d].grad, borderColor: 'transparent' } : {}}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>

          {/* Selected difficulty hint */}
          {difficulty !== 'random' && (
            <div style={{
              marginTop: 10, fontSize: 11, padding: '6px 12px', borderRadius: 10,
              background: 'rgba(99,102,241,0.06)', color: 'var(--text2)',
              border: '1px solid var(--border)', fontWeight: 500,
            }}>
              {difficulty === 'easy'   && '🟢 Easy words — great for new players!'}
              {difficulty === 'medium' && '🟡 Medium difficulty — balanced challenge'}
              {difficulty === 'hard'   && '🔴 Hard words — only for experienced players!'}
            </div>
          )}
        </div>

        <Button id="btn-create-room" onClick={handleCreate}>🎮 Create Room</Button>
        <Button variant="ghost" onClick={() => navigate('/')}>← Back to Home</Button>
      </div>

      <BottomNav active="create" navigate={navigate} />
    </div>
  );
}
