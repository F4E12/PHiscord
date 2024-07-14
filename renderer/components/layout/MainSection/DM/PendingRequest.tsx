import React, { useEffect, useState } from "react";
import { firestore, auth } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

const PendingRequests: React.FC = () => {
  const [user] = useAuthState(auth);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const userDocRef = doc(firestore, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
        const data = docSnapshot.data();
        const requests = await Promise.all(
          (data?.friendRequests || []).map(async (requestId: string) => {
            const requestDoc = await getDoc(doc(firestore, "users", requestId));
            return { id: requestDoc.id, ...requestDoc.data() };
          })
        );
        setPendingRequests(requests);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleAcceptRequest = async (senderUserId: string) => {
    if (!user) return;

    const userRef = doc(firestore, "users", user.uid);
    const senderRef = doc(firestore, "users", senderUserId);

    try {
      await updateDoc(userRef, {
        friends: arrayUnion(senderUserId),
        friendRequests: arrayRemove(senderUserId),
      });

      await updateDoc(senderRef, {
        friends: arrayUnion(user.uid),
      });

      toast({
        variant: "default",
        title: "Friend request accepted.",
      });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error accepting friend request.",
      });
    }
  };

  const handleRejectRequest = async (senderUserId: string) => {
    if (!user) return;

    const userRef = doc(firestore, "users", user.uid);

    try {
      await updateDoc(userRef, {
        friendRequests: arrayRemove(senderUserId),
      });

      toast({
        variant: "destructive",
        title: "Friend request rejected.",
      });
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error rejecting friend request.",
      });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-card text-card-foreground rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Pending Requests</h2>
      <ul>
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <li
              key={request.id}
              className="flex items-center justify-between p-2 mb-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover group"
            >
              <span>{request.displayname}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  className="text-sm px-2 py-1 bg-form text-foreground rounded-md hover:bg-form/80 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectRequest(request.id)}
                  className="text-sm px-2 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive-hover focus:outline-none focus:ring-2 focus:ring-destructive"
                >
                  Reject
                </button>
              </div>
            </li>
          ))
        ) : (
          <div className="">You have no pending request</div>
        )}
      </ul>
    </div>
  );
};

export default PendingRequests;
