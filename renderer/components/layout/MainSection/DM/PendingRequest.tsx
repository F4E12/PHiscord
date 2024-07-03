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

const PendingRequests: React.FC = () => {
  const [user] = useAuthState(auth);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

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

      alert("Friend request accepted.");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Error accepting friend request.");
    }
  };

  const handleRejectRequest = async (senderUserId: string) => {
    if (!user) return;

    const userRef = doc(firestore, "users", user.uid);

    try {
      await updateDoc(userRef, {
        friendRequests: arrayRemove(senderUserId),
      });

      alert("Friend request rejected.");
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      alert("Error rejecting friend request.");
    }
  };

  return (
    <div>
      <h2>Pending Requests</h2>
      <ul>
        {pendingRequests.map((request) => (
          <li key={request.id}>
            {request.displayname}
            <button onClick={() => handleAcceptRequest(request.id)}>
              Accept
            </button>
            <button onClick={() => handleRejectRequest(request.id)}>
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingRequests;
