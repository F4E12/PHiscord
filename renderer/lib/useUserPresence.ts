// useUserPresence.ts
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/firebase/firebaseApp';

function useUserPresence(userId: string) {
  const [presence, setPresence] = useState<{ online: boolean, last_changed: string } | null>(null);

  useEffect(() => {
    const userStatusDatabaseRef = ref(database, `presence/${userId}`);
    
    const unsubscribe = onValue(userStatusDatabaseRef, (snapshot) => {
      setPresence(snapshot.val());
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userId]);

  return presence;
}

export default useUserPresence;
