import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseApp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/components/ui/use-toast";

const NicknameSetting = ({ serverId }) => {
  const [user] = useAuthState(auth);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialNickname, setInitialNickname] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchNickname = async () => {
      const memberDocRef = doc(
        firestore,
        `servers/${serverId}/serverNickname/${user.uid}`
      );
      const docSnap = await getDoc(memberDocRef);

      if (docSnap.exists()) {
        setInitialNickname(docSnap.data().nickname || "");
        setNickname(docSnap.data().nickname);
      }
    };

    fetchNickname();
  }, [serverId, user]);

  const handleNicknameChange = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!nickname.trim()) {
      setError("Nickname cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const memberDocRef = doc(
        firestore,
        `servers/${serverId}/serverNickname/${user.uid}`
      );
      await setDoc(memberDocRef, {
        nickname: nickname.trim(),
      });
      setLoading(false);
      setNickname("");
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully changed nickname.",
      });
    } catch (err) {
      console.error("Error updating nickname:", err);
      setError("Failed to update nickname. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="items-center justify-center flex flex-col w-full">
      <div className="p-6 bg-background rounded-md shadow-md h-48 w-80">
        <h2 className="text-2xl font-bold mb-4 text-center text-foreground">
          Set Custom Nickname
        </h2>
        <form onSubmit={handleNicknameChange} className="space-y-4">
          <Input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={initialNickname || "Enter your custom nickname"}
            className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            disabled={loading}
          />
          {error && <p className="text-destructive text-center">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-form text-foreground font-semibold rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {loading ? "Updating..." : "Update Nickname"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NicknameSetting;
