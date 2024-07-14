import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseApp";

export const getUserData = async (userId: string) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
};

export const getUsersInServer = async (serverId: string) => {
  try {
    const serverDocRef = doc(firestore, "servers", serverId);
    const serverSnapshot = await getDoc(serverDocRef);

    if (!serverSnapshot.exists()) {
      console.error(`Server with ID ${serverId} does not exist.`);
      return [];
    }

    const serverData = serverSnapshot.data();

    if (serverData && serverData.members) {
      const userRefs = serverData.members.map((userId: string) =>
        doc(firestore, "users", userId)
      );

      const userSnapshots = await Promise.all(
        userRefs.map((userRef: any) => getDoc(userRef))
      );

      const users = userSnapshots.map((snapshot) => snapshot.data());

      return users;
    }

    console.warn(`Server with ID ${serverId} has no members.`);
    return [];
  } catch (error) {
    console.error(`Error fetching users for server ID ${serverId}:`, error);
    throw error;
  }
};
