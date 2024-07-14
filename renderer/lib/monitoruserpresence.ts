// monitorUserPresence.ts
import { database } from "@/firebase/firebaseApp";
import { ref, set, onValue, onDisconnect } from 'firebase/database';
import { getAuth } from 'firebase/auth';

function monitorUserPresence(userId: string) {
  const userStatusDatabaseRef = ref(database, `presence/${userId}`);
  const connectedRef = ref(database, '.info/connected');

  onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === false) {
      // Client is offline, set Realtime Database status to offline
      set(userStatusDatabaseRef, {
        online: false,
        last_changed: new Date().toISOString()
      });
      return;
    }

    // Client is online, set up onDisconnect and update Realtime Database status
    const onDisconnectRef = onDisconnect(userStatusDatabaseRef);
    onDisconnectRef.set({
      online: false,
      last_changed: new Date().toISOString()
    }).then(() => {
      set(userStatusDatabaseRef, {
        online: true,
        last_changed: new Date().toISOString()
      });
    }).catch(error => {
      console.error('Error setting up onDisconnect:', error);
    });
  });
}

export default monitorUserPresence;
