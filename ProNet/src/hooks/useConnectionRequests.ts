// src/hooks/useConnectionRequests.ts
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  acceptConnectionRequest,
  rejectConnectionRequest,
} from '../services/userService';

interface ConnectionRequest {
  id: string;
  from: string;
  fromName?: string;
  status: string;
}

export const useConnectionRequests = (userId: string) => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userId) return;
      try {
        const ref = collection(db, 'users', userId, 'connectionRequests');
        const snapshot = await getDocs(ref);

        const fetched = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            let fromName = '';
            try {
              const fromDoc = await getDoc(doc(db, 'users', data.from));
              fromName = fromDoc.exists() ? fromDoc.data().name : data.from;
            } catch {
              fromName = data.from;
            }

            return {
              id: docSnap.id,
              from: data.from,
              fromName,
              status: data.status,
            };
          })
        );

        setRequests(fetched.filter((r) => r.status === 'pending'));
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  const acceptRequest = async (fromUserId: string) => {
    await acceptConnectionRequest(userId, fromUserId);
    setRequests((prev) => prev.filter((r) => r.id !== fromUserId));
  };

  const rejectRequest = async (fromUserId: string) => {
    await rejectConnectionRequest(userId, fromUserId);
    setRequests((prev) => prev.filter((r) => r.id !== fromUserId));
  };

  return { requests, loading, acceptRequest, rejectRequest };
};
