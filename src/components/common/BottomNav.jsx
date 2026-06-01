import { memo } from 'react';

/**
 * BottomNav — persistent bottom navigation bar
 * active: current route id ('landing'|'create'|'join'|'leaderboard'|'profile')
 */
const TABS = [
  { id: 'landing',     icon: '🏠', label: 'Home',    path: '/' },
  { id: 'create',      icon: '➕', label: 'Create',  path: '/create' },
  { id: 'join',        icon: '🚪', label: 'Join',    path: '/join' },
  { id: 'leaderboard', icon: '🏆', label: 'Ranks',   path: '/leaderboard' },
  { id: 'profile',     icon: '👤', label: 'Profile', path: '/profile' },
];

const BottomNav = memo(function BottomNav({ active, navigate }) {
  return (
    <div className="bnav">
      {TABS.map(t => (
        <button
          key={t.id}
          className={`btab${active === t.id ? ' on' : ''}`}
          onClick={() => navigate(t.path)}
        >
          <span className="btab-i">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
});

export default BottomNav;
