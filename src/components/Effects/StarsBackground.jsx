import { memo } from 'react';

/**
 * FloatingOrbs — replaces dark stars with colorful floating blobs for light theme
 */
const FloatingOrbs = memo(function FloatingOrbs() {
  return (
    <div className="bg-orbs">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
    </div>
  );
});

export default FloatingOrbs;
