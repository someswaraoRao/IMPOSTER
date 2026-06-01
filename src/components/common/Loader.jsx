import { memo } from 'react';

const Loader = memo(function Loader() {
  return (
    <div className="dots">
      <span /><span /><span />
    </div>
  );
});

export default Loader;
