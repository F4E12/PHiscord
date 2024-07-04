import React, { useEffect, useState } from "react";
import { firestore, auth } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";

const BlockedFriends: React.FC = () => {
  const [user] = useAuthState(auth);
  const [blockedFriends, setBlockedFriends] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlockedFriends = async () => {
      if (!user) return;
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      if (userData && userData.blocked) {
        const friends = await Promise.all(
          userData.blocked.map(async (friendId: string) => {
            const friendDoc = await getDoc(doc(firestore, "users", friendId));
            return { id: friendDoc.id, ...friendDoc.data() };
          })
        );
        setBlockedFriends(friends);
      }
    };

    fetchBlockedFriends();
  }, [user]);

  const unblockFriend = async (friendId: string) => {
    if (user) {
      const userDocRef = doc(firestore, "users", user.uid);
      await updateDoc(userDocRef, {
        blocked: arrayRemove(friendId),
      });
      setBlockedFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== friendId)
      );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-card text-card-foreground rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Blocked Friends</h2>
      <ul>
        {blockedFriends.map((friend) => (
          <li
            key={friend.id}
            className="flex items-center justify-between p-2 mb-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover group"
          >
            <span>{friend.displayname}</span>
            <button
              onClick={() => unblockFriend(friend.id)}
              className="opacity-0 group-hover:opacity-100 text-sm px-2 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive-hover focus:outline-none focus:ring-2 focus:ring-destructive"
            >
              Unblock
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlockedFriends;
