import { memo } from 'react';

// No-op for light theme — orbs are handled by StarsBackground/FloatingOrbs
const NebulaBackground = memo(function NebulaBackground() {
  return null;
});

export default NebulaBackground;
