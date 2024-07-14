import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseApp';

export const updateUserData = async (userId: string, data: any) => {
  try {
    const userDocRef = doc(firestore, 'users', userId);
    await setDoc(userDocRef, data, { merge: true });
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};
