import { useEffect } from 'react';
import { auth, database } from '@/firebase/firebaseApp';
import { onDisconnect, onValue, ref, serverTimestamp, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const useUserPresence = (userId: string) => {
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const userPresenceDatabaseRef = ref(database, `presence/${userId}`);

    const isOfflineForDatabase = {
      online: false,
      last_changed: serverTimestamp(),
    };

    const isOnlineForDatabase = {
      online: true,
      last_changed: serverTimestamp(),
    };

    const connectedRef = ref(database, '.info/connected');
    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) {
        return;
      }

      onDisconnect(userPresenceDatabaseRef).set(isOfflineForDatabase).then(() => {
        set(userPresenceDatabaseRef, isOnlineForDatabase);
      });
    });

    return () => {
      set(userPresenceDatabaseRef, isOfflineForDatabase);
    };
  }, [userId]);
};

export default useUserPresence;
