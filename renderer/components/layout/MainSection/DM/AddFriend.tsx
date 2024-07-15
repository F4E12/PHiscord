import React, { useState } from "react";
import { firestore, auth } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

const AddFriend: React.FC = () => {
  const [user] = useAuthState(auth);
  const [targetUserId, setTargetUserId] = useState("");
  const { toast } = useToast();

  const handleSendRequest = async () => {
    if (!user || !targetUserId) return;
    if (targetUserId.includes("/")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error sending friend request.",
      });
      return;
    }
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
    <div className="">
      <div className="flex gap-2">
        <input
          type="text"
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
          placeholder="Enter user ID to send friend request"
          className="w-full px-4 py-2 bg-primary text-foreground rounded focus:outline-none"
        />
        <button
          onClick={handleSendRequest}
          className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 w-32"
        >
          Add Friend
        </button>
      </div>
      <div className="flex items-center justify-center h-full mt-10">
        <Image
          src="/images/AddFriend.png"
          width={500}
          height={500}
          alt="Add Friend"
        ></Image>
      </div>
    </div>
  );
};

export default AddFriend;
