import { firestore } from '@/firebase/firebaseApp';
import { doc, getDoc } from 'firebase/firestore';

export const getServerDetails = async (serverId: string) => {
  try {
    const serverRef = doc(firestore, 'servers', serverId);
    const serverDoc = await getDoc(serverRef);
    if (serverDoc.exists()) {
      return { id: serverDoc.id, ...serverDoc.data() };
    } 
  } catch (error) {
    console.error('Error fetching server details:', error);
    throw error;
  }
};

export const getAllServerDetails = async (serverIds: string[]) => {
  try {
    const serverDetailsPromises = serverIds.map((serverId) =>
      getServerDetails(serverId)
    );
    return await Promise.all(serverDetailsPromises);
  } catch (error) {
    console.error('Error fetching all server details:', error);
    throw error;
  }
};
