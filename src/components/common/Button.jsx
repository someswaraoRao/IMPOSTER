import { memo } from 'react';

/**
 * Button — styled action button
 * variant: 'primary' | 'ghost' | 'danger' | 'success'
 */
const Button = memo(function Button({ children, variant = 'primary', onClick, disabled, style, id }) {
  return (
    <button
      id={id}
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
});

export default Button;
