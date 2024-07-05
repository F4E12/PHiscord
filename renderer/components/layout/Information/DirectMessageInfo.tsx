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
        }
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="">
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
      {allFriends.map((friend, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 hover:cursor-pointer hover:bg-background p-1 rounded m-2"
          onClick={() => setSelectedFriend(friend.id)}
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>{friend.displayname}</AvatarFallback>
          </Avatar>
          <span className="text-white">{friend.displayname}</span>
        </div>
      ))}
    </div>
  );
};

export default DirectMessageInfo;
