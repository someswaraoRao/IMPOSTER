import { useState, useRef, memo, useCallback } from 'react';

const ChatInput = memo(function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    inputRef.current?.focus();
  }, [text, onSend]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  return (
    <div className="chat-row">
      <input
        ref={inputRef}
        type="text"
        id="chat-input"
        placeholder="Share your suspicions…"
        maxLength={120}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="btn-sm sel" id="send-btn" onClick={handleSend}>Send</button>
    </div>
  );
});

export default ChatInput;
