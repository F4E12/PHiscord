import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase/firebaseApp'; // Ensure this path is correct

export const uploadImage = async (file: File, userId: string) => {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};