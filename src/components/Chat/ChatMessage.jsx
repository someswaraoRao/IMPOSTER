import { memo } from 'react';

const ChatMessage = memo(function ChatMessage({ msg, isMe }) {
  return (
    <div className={`msg ${isMe ? 'msg-me' : 'msg-other'}`}>
      {!isMe && (
        <div className="msg-name">{msg.av} {msg.name}</div>
      )}
      <div className="msg-text">{msg.text}</div>
    </div>
  );
});

export default ChatMessage;
