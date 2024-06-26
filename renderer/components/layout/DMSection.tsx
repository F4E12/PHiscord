interface DMSectionProps {
  friend: any;
}

const DMSection = ({ friend }: DMSectionProps) => {
  return (
    <div className="overflow-auto">
      {/* Chat content goes here */}
      DM
      {friend}
      <div className="chat-messages">{/* Render chat messages */}</div>
      <div className="chat-input">{/* Input for sending messages */}</div>
    </div>
  );
};

export default DMSection;
