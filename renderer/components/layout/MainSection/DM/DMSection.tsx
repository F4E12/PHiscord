import DMChat from "./DMChat";
import DMMenu from "./DMMenu";

interface DMSectionProps {
  friend: any;
  setSelectedFriend: (friend: any | null) => void;
}

const DMSection = ({ friend, setSelectedFriend }: DMSectionProps) => {
  return (
    <div className="overflow-auto h-full">
      {friend === "friendMenu" ? (
        <DMMenu setSelectedFriend={setSelectedFriend} />
      ) : (
        <DMChat friendId={friend} />
      )}
    </div>
  );
};

export default DMSection;
