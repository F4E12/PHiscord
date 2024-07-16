import React, { useEffect, useRef, useState } from "react";
import { firestore, auth, database } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { ref, onValue, off } from "firebase/database";
import useUserPresence from "@/lib/useUserPresence";
import { useToast } from "@/components/ui/use-toast";

interface OnlineFriendProps {
  setSelectedFriend: (friend: any | null) => void;
}

const OnlineFriends = ({ setSelectedFriend }: OnlineFriendProps) => {
  const [user] = useAuthState(auth);
  const [onlineFriends, setOnlineFriends] = useState<any[]>([]);
  const friendsRefs = useRef<any[]>([]);
  const { toast } = useToast();

  // useUserPresence(user?.uid || "");

  useEffect(() => {
    const fetchOnlineFriends = async () => {
      if (!user) return;
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      if (userData && userData.friends) {
        // Check if the user has friends
        const newFriendsRefs = []; // Array to store new friends' Realtime Database references
        const friends = await Promise.all(
          userData.friends.map(async (friendId: string) => {
            try {
              const friendDoc = await getDoc(doc(firestore, "users", friendId));
              const friendData = friendDoc.data();

              const friendStatusRef = ref(
                database,
                `presence/${friendId}/online`
              ); // Get a reference to the friend's presence status in Realtime Database
              newFriendsRefs.push(friendStatusRef); // Add the reference to the array

              onValue(friendStatusRef, (snapshot) => {
                // Set up a listener for the friend's presence status
                const isOnline = snapshot.val() === true;
                setOnlineFriends((prevFriends) => {
                  // Update the online friends state
                  const updatedFriends = prevFriends.filter(
                    (f) => f.id !== friendId
                  ); // Remove the friend if already in the list
                  if (isOnline) {
                    // If the friend is online, add them to the list
                    updatedFriends.push({ id: friendDoc.id, ...friendData });
                  }
                  return updatedFriends; // Return the updated friends list
                });
              });

              return null;
            } catch (error) {
              console.error(
                `Error fetching data for friend ID ${friendId}:`,
                error
              );
              return null;
            }
          })
        );
        friendsRefs.current = newFriendsRefs; // Update the ref with the new friends' references
      }
    };

    fetchOnlineFriends(); // Call the function to fetch online friends

    return () => {
      friendsRefs.current.forEach((ref) => off(ref)); // Remove each listener using the `off` function
    };
  }, [user]);

  return (
    <div className="p-4 max-w-md mx-auto bg-card text-card-foreground rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Online Friends</h2>
      <ul>
        {onlineFriends.length > 0 ? (
          onlineFriends.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center justify-between p-2 mb-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/70 hover:cursor-pointer group"
              onClick={() => setSelectedFriend(friend.id)}
            >
              <span>{friend.displayname}</span>
            </li>
          ))
        ) : (
          <div>You have no online friend</div>
        )}
      </ul>
    </div>
  );
};
export default OnlineFriends;
