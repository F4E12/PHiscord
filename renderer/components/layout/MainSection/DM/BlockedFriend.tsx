import React, { useEffect, useState } from "react";
import { firestore, auth } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";

const BlockedFriends: React.FC = () => {
  const [user] = useAuthState(auth);
  const [blockedFriends, setBlockedFriends] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlockedFriends = async () => {
      if (!user) return;
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      if (userData && userData.blockedUsers) {
        const friends = await Promise.all(
          userData.blockedUsers.map(async (friendId: string) => {
            const friendDoc = await getDoc(doc(firestore, "users", friendId));
            return { id: friendDoc.id, ...friendDoc.data() };
          })
        );
        setBlockedFriends(friends);
      }
    };

    fetchBlockedFriends();
  }, [user]);

  return (
    <div>
      <h2>Blocked Friends</h2>
      <ul>
        {blockedFriends.map((friend) => (
          <li key={friend.id}>{friend.displayName}</li>
        ))}
      </ul>
    </div>
  );
};

export default BlockedFriends;
