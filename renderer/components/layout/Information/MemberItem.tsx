import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebaseApp";
import { useEffect, useState } from "react";
import { getUserData } from "@/lib/retrieveuser";

const MemberItem = ({ member }) => {
  const [user] = useAuthState(auth);
  const [newMessage, setNewMessage] = useState("");
  const [channelId, setChannelId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !member.id) return;
    fetchChannelId();
  }, [user, member.id]);

  const handleSendRequest = async (targetUserId: string) => {
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

  const fetchChannelId = async () => {
    try {
      const userDocRef = doc(
        firestore,
        "users",
        user.uid,
        "directMessage",
        member.id
      );
      const friendDocRef = doc(
        firestore,
        "users",
        member.id,
        "directMessage",
        user.uid
      );

      const userDoc = await getDoc(userDocRef);
      const friendDoc = await getDoc(friendDocRef);

      let channelId = userDoc.exists() ? userDoc.data()?.channelId : null;

      if (!channelId) {
        channelId = friendDoc.exists() ? friendDoc.data()?.channelId : null;
      }
      if (!channelId) {
        const newChannelRef = doc(collection(firestore, "directMessages"));
        channelId = newChannelRef.id;
        await setDoc(newChannelRef, {
          members: [user.uid, member.id],
        });

        await setDoc(
          doc(firestore, "users", user.uid, "directMessage", member.id),
          {
            channelId: channelId,
          }
        );
        await setDoc(
          doc(firestore, "users", member.id, "directMessage", user.uid),
          {
            channelId: channelId,
          }
        );
      }

      setChannelId(channelId);
    } catch (error) {
      console.error("Error fetching or creating channel ID:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    setNewMessage("");
    await addDoc(
      collection(firestore, `directMessages/${channelId}/messages`),
      {
        text: newMessage,
        createdAt: serverTimestamp(),
        uid: user?.uid,
        fileType: "",
        fileURL: "",
        fileName: "",
      }
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2 bg-gray-700 p-2 rounded-md mb-2">
            <Avatar>
              <AvatarImage
                src={member?.profilePicture}
                alt={member?.displayname}
              />
              <AvatarFallback>
                {member.displayname?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-white font-bold">
                {member.displayname || "Unknown"}
              </div>
              <div className="text-gray-400 text-sm">@{member?.username}</div>
            </div>
          </div>
        </TooltipTrigger>
        {user.uid !== member.id && (
          <TooltipContent side="left" className="p-2">
            {member.displayname}
            <Button
              type="submit"
              className={buttonVariants({ variant: "form" })}
              onClick={() => handleSendRequest(member.id)}
            >
              Add Friend
            </Button>
            <form onSubmit={sendMessage} className="mt-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-2 rounded bg-gray-700 text-white w-40"
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 rounded text-white hover:bg-blue-700"
              >
                Send
              </button>
            </form>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
export default MemberItem;
