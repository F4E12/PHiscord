import { firestore } from '@/firebase/firebaseApp';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

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

export const getTextChannels = async (serverId) => {
  try {
    const channelsRef = collection(firestore, `servers/${serverId}/textChannels`);
    const querySnapshot = await getDocs(channelsRef);
    const textChannels = [];

    querySnapshot.forEach((doc) => {
      textChannels.push({ id: doc.id, ...doc.data() });
    });

    return textChannels;
  } catch (error) {
    console.error('Error getting text channels:', error);
    throw error;
  }
};

export const getVoiceChannels = async (serverId) => {
  try {
    const channelsRef = collection(firestore, `servers/${serverId}/voiceChannels`);
    const querySnapshot = await getDocs(channelsRef);
    const voiceChannels = [];

    querySnapshot.forEach((doc) => {
      voiceChannels.push({ id: doc.id, ...doc.data() });
    });

    return voiceChannels;
  } catch (error) {
    console.error('Error getting voice channels:', error);
    throw error;
  }
};
