import React, { useEffect, useState } from "react";
import { firestore, auth, database } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { ref, onValue } from "firebase/database";
import useUserPresence from "@/lib/useUserPresence";

const OnlineFriends: React.FC = () => {
  const [user] = useAuthState(auth);
  const [onlineFriends, setOnlineFriends] = useState<any[]>([]);

  useUserPresence(user?.uid || "");

  useEffect(() => {
    const fetchOnlineFriends = async () => {
      if (!user) return;
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      if (userData && userData.friends) {
        const friends = await Promise.all(
          userData.friends.map(async (friendId: string) => {
            try {
              const friendDoc = await getDoc(doc(firestore, "users", friendId));
              const friendData = friendDoc.data();

              const friendStatusRef = ref(
                database,
                `presence/${friendId}/online`
              );
              const isOnline = await new Promise<boolean>((resolve, reject) => {
                onValue(
                  friendStatusRef,
                  (snapshot) => {
                    console.log(
                      `Presence data for ${friendId}:`,
                      snapshot.val()
                    );
                    resolve(snapshot.val() === true);
                  },
                  (error) => {
                    console.error(
                      `Error fetching presence data for ${friendId}:`,
                      error
                    );
                    reject(error);
                  },
                  { onlyOnce: true }
                );
              });

              console.log(`Friend ID: ${friendId}, isOnline: ${isOnline}`);
              return isOnline ? { id: friendDoc.id, ...friendData } : null;
            } catch (error) {
              console.error(
                `Error fetching data for friend ID ${friendId}:`,
                error
              );
              return null;
            }
          })
        );
        setOnlineFriends(friends.filter((friend) => friend !== null));
      }
    };

    fetchOnlineFriends();
  }, [user]);

  return (
    <div>
      <h2>Online Friends</h2>
      <ul>
        {onlineFriends.map((friend) => (
          <li key={friend.id}>{friend.displayName}</li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineFriends;
