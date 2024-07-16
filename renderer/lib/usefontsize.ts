import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { database } from '@/firebase/firebaseApp';

const useFontSize = (userId) => {
  const [fontSize, setFontSize] = useState(null);

  useEffect(() => {
    const fontSizeRef = ref(database, `users/${userId}/settings/fontSize`);

    const unsubscribe = onValue(fontSizeRef, (snapshot) => {
      const value = snapshot.val();
      setFontSize(value);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return fontSize;
};

export default useFontSize;
