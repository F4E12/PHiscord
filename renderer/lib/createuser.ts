import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseApp";

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up with email and password", error);
    throw error;
  }
};
