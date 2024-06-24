import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseApp";

export const getUserData = async (userId: string) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
};
