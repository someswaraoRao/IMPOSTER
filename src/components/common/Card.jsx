import { memo } from 'react';

/**
 * Card — styled card container
 * glow: 'blue' | 'green' | 'red' | undefined
 */
const Card = memo(function Card({ children, glow, style, className = '' }) {
  const glowClass = glow ? ` card-glow-${glow}` : '';
  return (
    <div className={`card${glowClass} ${className}`} style={style}>
      {children}
    </div>
  );
});

export default Card;
