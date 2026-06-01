import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Navbar — top navigation bar (light theme)
 */
const Navbar = memo(function Navbar({ pill }) {
  const navigate = useNavigate();
  return (
    <div className="nav">
      <div className="logo" onClick={() => navigate('/')}>
        Imposter<em>Hunt</em>
      </div>
      {pill && <div className="pill">{pill}</div>}
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn-icon-sm" onClick={() => navigate('/leaderboard')} title="Leaderboard">🏆</button>
        <button className="btn-icon-sm" onClick={() => navigate('/profile')} title="Profile">👤</button>
      </div>
    </div>
  );
});

export default Navbar;
