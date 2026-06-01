import { memo } from 'react';
import { AVATARS } from '../../data/avatars';

/**
 * AvatarPicker — row of emoji avatar buttons
 */
const AvatarPicker = memo(function AvatarPicker({ selected, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {AVATARS.map(a => (
        <button
          key={a}
          className={`btn-sm${selected === a ? ' sel' : ''}`}
          onClick={() => onSelect(a)}
        >
          {a}
        </button>
      ))}
    </div>
  );
});

export default AvatarPicker;
