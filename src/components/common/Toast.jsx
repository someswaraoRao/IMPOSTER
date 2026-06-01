import { useState, useCallback, createContext, useContext, memo } from 'react';

const ToastContext = createContext(null);

let toastTimeout = null;

export function ToastProvider({ children }) {
  const [msg, setMsg]       = useState('');
  const [visible, setVisible] = useState(false);

  const showToast = useCallback((message, duration = 2200) => {
    setMsg(message);
    setVisible(true);
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => setVisible(false), duration);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div id="toast" className={`toast${visible ? ' show' : ''}`}>{msg}</div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
