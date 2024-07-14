import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseApp';

export const updateServerData = async (serverId: string, data: any) => {
  try {
    const serverDocRef = doc(firestore, 'servers', serverId);
    await setDoc(serverDocRef, data, { merge: true });
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};
