// updateUserStatus.ts
import { firestore } from "@/firebase/firebaseApp";
import { doc, updateDoc } from "firebase/firestore";

// Function to update user status
async function updateUserStatus(userId: string, status: string) {
  const userDocRef = doc(firestore, "users", userId);

  try {
    await updateDoc(userDocRef, {
      status: status,
      last_changed: new Date().toISOString()
    });
    console.log("User status updated to:", status);
  } catch (error) {
    console.error("Error updating user status:", error);
  }
}

export default updateUserStatus;
