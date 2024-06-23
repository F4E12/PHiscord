const ChatSection = () => {
  return (
    <div className="overflow-auto">
      {/* Chat content goes here */}
      <h2 className="text-white">Chat</h2>
      <div className="chat-messages">{/* Render chat messages */}</div>
      <div className="chat-input">{/* Input for sending messages */}</div>
    </div>
  );
};

export default ChatSection;
