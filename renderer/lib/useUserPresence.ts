import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { database } from '@/firebase/firebaseApp';
import { onDisconnect, onValue, ref, serverTimestamp, set } from 'firebase/database';

const useUserPresence = (userId: string) => {
  const [isOnline, setIsOnline] = useState(false);

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
        setIsOnline(true);
      });
    });

    return () => {
      set(userPresenceDatabaseRef, isOfflineForDatabase);
      setIsOnline(false);
    };
  }, [userId]);

  return isOnline;
};

export default useUserPresence;
