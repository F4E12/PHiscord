import React, { useEffect, useState } from "react";
import { firestore, auth } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";

const AllFriends: React.FC = () => {
  const [user] = useAuthState(auth);
  const [allFriends, setAllFriends] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllFriends = async () => {
      if (!user) return;
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      console.log(userData.friends);
      if (userData && userData.friends) {
        const friends = await Promise.all(
          userData.friends.map(async (friendId: string) => {
            const friendDoc = await getDoc(doc(firestore, "users", friendId));
            return { id: friendDoc.id, ...friendDoc.data() };
          })
        );
        setAllFriends(friends);
      }
    };

    fetchAllFriends();
  }, [user]);
  console.log(allFriends);
  return (
    <div>
      <h2>All Friends</h2>
      <ul>
        {allFriends.map((friend) => (
          <li key={friend.id}>{friend.displayname}</li>
        ))}
      </ul>
    </div>
  );
};

export default AllFriends;
