import React, { useEffect, useState } from "react";
import { firestore, auth } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

interface AllFriendProps {
  setSelectedFriend: (friend: any | null) => void;
}

const AllFriends = ({ setSelectedFriend }: AllFriendProps) => {
  const [user] = useAuthState(auth);
  const [allFriends, setAllFriends] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(firestore, "users", user.uid);

    const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        console.log(userData.friends);

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

  const removeFriend = async (friendId: string) => {
    if (user) {
      const userDocRef = doc(firestore, "users", user.uid);
      const friendDocRef = doc(firestore, "users", friendId);

      await updateDoc(userDocRef, {
        friends: arrayRemove(friendId),
      });

      await updateDoc(friendDocRef, {
        friends: arrayRemove(user.uid),
      });

      setAllFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== friendId)
      );
    }
  };

  const blockFriend = async (friendId: string) => {
    if (user) {
      const userDocRef = doc(firestore, "users", user.uid);
      const friendDocRef = doc(firestore, "users", friendId);

      await updateDoc(userDocRef, {
        blocked: arrayUnion(friendId),
        friends: arrayRemove(friendId),
      });

      await updateDoc(friendDocRef, {
        friends: arrayRemove(user.uid),
      });

      setAllFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== friendId)
      );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-card text-card-foreground rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">All Friends</h2>
      <ul>
        {allFriends.length > 0 ? (
          allFriends.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center justify-between p-2 mb-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/70 hover:cursor-pointer group"
              onClick={() => setSelectedFriend(friend.id)}
            >
              <span>{friend.displayname}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => removeFriend(friend.id)}
                  className="opacity-0 group-hover:opacity-100 text-sm px-2 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive-hover focus:outline-none focus:ring-2 focus:ring-destructive"
                >
                  Remove
                </button>
                <button
                  onClick={() => blockFriend(friend.id)}
                  className="opacity-0 group-hover:opacity-100 text-sm px-2 py-1 bg-muted text-muted-foreground rounded-md hover:bg-muted-hover focus:outline-none focus:ring-2 focus:ring-muted"
                >
                  Block
                </button>
              </div>
            </li>
          ))
        ) : (
          <div className="">You have no friend</div>
        )}
      </ul>
    </div>
  );
};

export default AllFriends;
