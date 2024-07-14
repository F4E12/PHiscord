import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Icon from "@/components/ui/icon";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebaseApp";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

interface DirectMessageProps {
  setSelectedFriend: (friend: any | null) => void;
}

const DirectMessageInfo = ({ setSelectedFriend }: DirectMessageProps) => {
  const [user] = useAuthState(auth);
  const [allFriends, setAllFriends] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(firestore, "users", user.uid);

    const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();

        if (userData && userData.friends) {
          const friends = await Promise.all(
            userData.friends.map(async (friendId) => {
              const friendDoc = await getDoc(doc(firestore, "users", friendId));
              return { id: friendDoc.id, ...friendDoc.data() };
            })
          );
          setAllFriends(friends);
          setFilteredFriends(friends);
        }
      }
    });

    return () => unsubscribe();
  }, [user]);

  // SEARCH CONVERSATION
  const [searchItem, setSearchItem] = useState("");
  const [filteredFriends, setFilteredFriends] = useState(allFriends);

  const handleSearchConversation = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = allFriends.filter((friend) =>
      friend.displayname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredFriends(filteredItems);
  };

  return (
    <div className="">
      <div className="p-2 border-b-2 border-[#202124] flex justify-between items-center bg-secondary">
        <div className="flex items-center bg-primary rounded px-1 w-full">
          <input
            type="text"
            value={searchItem}
            onChange={handleSearchConversation}
            placeholder="Search Conversation"
            className="bg-primary rounded text-foreground placeholder-foreground focus:outline-none w-52"
          />
          <button type="submit" className="text-foreground ml-2">
            <Icon type="search"></Icon>
          </button>
        </div>
      </div>
      <div
        className="flex flex-col space-y-2 p-2"
        onClick={() => setSelectedFriend("friendMenu")}
      >
        <div className="flex items-center hover:cursor-pointer hover:bg-background p-3 rounded gap-5">
          <Icon type="friend" />
          Friends
        </div>
      </div>
      <div className="pl-2 hover:cursor-default">Direct Message</div>
      {filteredFriends.map((friend, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 hover:cursor-pointer hover:bg-background p-1 rounded m-2"
          onClick={() => setSelectedFriend(friend.id)}
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>{friend.displayname}</AvatarFallback>
          </Avatar>
          <span className="text-foreground">{friend.displayname}</span>
        </div>
      ))}
    </div>
  );
};

export default DirectMessageInfo;
