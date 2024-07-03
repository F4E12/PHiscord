import DMMenu from "./DMMenu";

interface DMSectionProps {
  friend: any;
}

const DMSection = ({ friend }: DMSectionProps) => {
  return (
    <div className="overflow-auto">
      {/* Chat content goes here */}
      {friend}
      {friend === "friendMenu" ? (
        <DMMenu />
      ) : (
        <div className="">
          <div className="chat-messages">CHATTING</div>
          <div className="chat-input">KIRIM</div>
        </div>
      )}
    </div>
  );
};

export default DMSection;
