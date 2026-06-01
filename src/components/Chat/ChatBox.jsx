import { useRef, useEffect, memo } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

/**
 * ChatBox — scrollable chat log + input row
 */
const ChatBox = memo(function ChatBox({ messages, myId, onSend }) {
  const logRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="card"
      style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', marginBottom: 10 }}
    >
      <div className="chat-log" ref={logRef}>
        {messages.map(m => (
          <ChatMessage key={m.id} msg={m} isMe={m.pid === myId} />
        ))}
      </div>
      <ChatInput onSend={onSend} />
    </div>
  );
});

export default ChatBox;
