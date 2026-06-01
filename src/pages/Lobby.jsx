import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import PlayerGrid from '../components/Player/PlayerGrid';
import Loader from '../components/common/Loader';
import { useGame } from '../context/GameContext';
import { useToast } from '../components/common/Toast';
import { MAX_PLAYERS, MIN_PLAYERS } from '../utils/constants';

export default function Lobby() {
  const navigate = useNavigate();
  const toast = useToast();
  const { players, myId, roomCode, startGame, addCpuPlayer } = useGame();
  const me = players.find(p => p.id === myId);
  const full = players.length >= MAX_PLAYERS;
  const canStart = players.length >= MIN_PLAYERS && players.length <= MAX_PLAYERS;

  const handleAddBot = useCallback(() => {
    if (!full) {
      addCpuPlayer(players.length - 1); // just pass the next index
    }
  }, [full, addCpuPlayer, players.length]);

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(roomCode);
    toast('📋 Room code copied!');
  }, [roomCode, toast]);

  const handleStart = useCallback(() => {
    startGame();
    navigate('/word-reveal');
  }, [startGame, navigate]);

  return (
    <div className="screen fade-in">
      <Navbar pill="LOBBY" />

      <div className="s-content">

        {/* Room code card */}
        <div className="slide-in" style={{ textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08))',
            border: '1.5px solid rgba(99,102,241,0.2)',
            borderRadius: 'var(--radius-xl)',
            padding: '20px 16px 16px',
          }}>
            <div className="label" style={{ marginBottom: 4 }}>Room Code</div>
            <div className="room-code">{roomCode}</div>
            <button
              id="copy-btn"
              className="btn-icon-sm"
              onClick={handleCopy}
              style={{ marginTop: 4, fontSize: 12, padding: '8px 16px' }}
            >
              📋 Copy &amp; Share
            </button>
          </div>
        </div>

        {/* Players card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Players</div>
              <div className="label" style={{ marginTop: 2 }}>{players.length} / {MAX_PLAYERS} joined</div>
            </div>
            {full
              ? (
                <span style={{
                  fontSize: 11, color: '#fff', fontWeight: 800,
                  background: 'var(--grad-success)',
                  padding: '5px 12px', borderRadius: 20,
                  boxShadow: '0 2px 10px rgba(16,185,129,0.3)',
                }}>
                  ✓ MAX CAPACITY
                </span>
              )
              : <Loader />
            }
          </div>
          <PlayerGrid players={players} myId={myId} />
          {me?.host && !full && (
            <button
              className="btn btn-ghost"
              onClick={handleAddBot}
              style={{ width: '100%', marginTop: 12, padding: '10px' }}
            >
              🤖 Add CPU Bot
            </button>
          )}
        </div>

        {/* Start / waiting */}
        {me?.host
          ? (
            <Button id="btn-start" onClick={handleStart} disabled={!canStart}>
              {canStart ? '🎮 Start Game' : `⏳ Need ${MIN_PLAYERS - players.length} more players…`}
            </Button>
          )
          : (
            <div className="card-inset" style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, fontWeight: 500 }}>
              ⏳ Waiting for host to start…
            </div>
          )
        }

        <Button variant="ghost" onClick={() => navigate('/')}>← Leave Room</Button>
      </div>
    </div>
  );
}
