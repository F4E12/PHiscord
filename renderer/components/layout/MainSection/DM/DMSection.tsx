import DMChat from "./DMChat";
import DMMenu from "./DMMenu";

interface DMSectionProps {
  friend: any;
  setSelectedFriend: (friend: any | null) => void;
}

const DMSection = ({ friend, setSelectedFriend }: DMSectionProps) => {
  return (
    <>
      {friend === "friendMenu" ? (
        <DMMenu setSelectedFriend={setSelectedFriend} />
      ) : (
        <DMChat friendId={friend} />
      )}
    </>
  );
};

export default DMSection;
