import { memo } from 'react';

/**
 * Confetti — DOM container for confetti particles.
 * Actual particle injection is done via useConfetti() hook.
 */
const Confetti = memo(function Confetti() {
  return <div id="confetti-root" className="confetti-container" />;
});

export default Confetti;
