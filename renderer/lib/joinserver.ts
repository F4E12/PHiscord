import { toast } from "@/components/ui/use-toast";
import { firestore } from "@/firebase/firebaseApp";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export const joinServer = async (serverCode: string, user: any) => {
  try {
    // Get server document by server code
    const prefix = "phiscord.join/";

    if (serverCode.startsWith(prefix)) {
      const parts = serverCode.split('/');
      const lastPart = parts.pop();
      serverCode = lastPart;
    } else {
      toast({
        variant: "destructive",
        title: "Error Join Server",
        description: "Invalid Join Link.",
      });
      return;
    }
    const serverDocRef = doc(firestore, "servers", serverCode);
    const serverDoc = await getDoc(serverDocRef);

    if (serverDoc.exists()) {
      const serverData = serverDoc.data();

      // Check if the user is already a member
      if (serverData.members.includes(user.id)) {
        toast({
          variant: "destructive",
          title: "Error Join Server",
          description: "You are already a member of this server.",
        });
      }

      // Update server's members list
      await updateDoc(serverDocRef, {
        members: arrayUnion(user.id),
      });

      // Update user's server list
      const userDocRef = doc(firestore, "users", user.id);
      await updateDoc(userDocRef, {
        serverList: arrayUnion(serverCode),
      });

      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error Join Server",
        description: "Server Not Found",
      });
    }
  } catch (error) {
    console.error("Error joining server:", error);
    throw error;
  }
};
