// src/hooks/useConnectionsList.ts
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

interface ConnectedUser {
  id: string;
  name: string;
  email: string;
}

export const useConnectionsList = (userId: string) => {
  const [connections, setConnections] = useState<ConnectedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!userId) return;
      try {
        const ref = collection(db, 'users', userId, 'connections');
        const snapshot = await getDocs(ref);

        const fetched = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const otherUserId = docSnap.id;
            const userDoc = await getDoc(doc(db, 'users', otherUserId));
            const userData = userDoc.data();

            return {
              id: otherUserId,
              name: userData?.name || 'Unknown',
              email: userData?.email || '',
            };
          })
        );

        setConnections(fetched);
      } catch (err) {
        console.error('Error fetching connections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [userId]);

  return { connections, loading };
};
