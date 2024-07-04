import React, { useState } from "react";
import { firestore, auth } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

const AddFriend: React.FC = () => {
  const [user] = useAuthState(auth);
  const [targetUserId, setTargetUserId] = useState("");
  const { toast } = useToast();

  const handleSendRequest = async () => {
    if (!user || !targetUserId) return;
    if (user.uid === targetUserId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You cannot add yourself as a friend.",
      });
      return;
    }

    const userRef = doc(firestore, "users", user.uid);
    const targetUserRef = doc(firestore, "users", targetUserId);

    try {
      // Get the current user's document
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      // Check if the target user is already a friend
      if (
        userData &&
        userData.friends &&
        userData.friends.includes(targetUserId)
      ) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You are already friends with this user.",
        });
        return;
      }

      // Get the target user's document
      const targetUserDoc = await getDoc(targetUserRef);
      const targetUserData = targetUserDoc.data();

      // Check if the target user has already sent a friend request
      if (
        targetUserData &&
        targetUserData.friendRequests &&
        targetUserData.friendRequests.includes(user.uid)
      ) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "This user has already sent you a friend request.",
        });
        return;
      }

      // Send the friend request
      await updateDoc(targetUserRef, {
        friendRequests: arrayUnion(user.uid),
      });

      toast({
        variant: "default",
        title: "Success",
        description: "Friend request sent successfully.",
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error sending friend request.",
      });
    }
  };

  return (
    <div>
      <input
        type="text"
        value={targetUserId}
        onChange={(e) => setTargetUserId(e.target.value)}
        placeholder="Enter user ID to send friend request"
        className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
      />
      <button
        onClick={handleSendRequest}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Friend
      </button>
    </div>
  );
};

export default AddFriend;
