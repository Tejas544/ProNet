// src/services/userService.ts
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface User {
  id: string;
  name: string;
  email: string;
}

// 🔍 Search users by name (excluding self)
export const searchUsers = async (
  keyword: string,
  currentUserId: string
): Promise<User[]> => {
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    where('name', '>=', keyword),
    where('name', '<=', keyword + '\uf8ff')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .filter((doc) => doc.id !== currentUserId)
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'No Name',
        email: data.email || 'No Email',
      };
    });
};

// 🤝 Send a connection request
export const sendConnectionRequest = async (
  fromUserId: string,
  toUserId: string
) => {
  if (!fromUserId || !toUserId) throw new Error('Invalid user IDs');

  const requestRef = doc(db, `users/${toUserId}/connectionRequests/${fromUserId}`);

  await setDoc(requestRef, {
    from: fromUserId,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

// ✅ Accept a request (adds both to each other's `connections`)
export const acceptConnectionRequest = async (
  currentUserId: string,
  fromUserId: string
) => {
  const userConnRef = doc(db, 'users', currentUserId, 'connections', fromUserId);
  const senderConnRef = doc(db, 'users', fromUserId, 'connections', currentUserId);

  await Promise.all([
    setDoc(userConnRef, { since: serverTimestamp() }),
    setDoc(senderConnRef, { since: serverTimestamp() }),
    deleteDoc(doc(db, 'users', currentUserId, 'connectionRequests', fromUserId)),
  ]);
};

// ❌ Reject a request
export const rejectConnectionRequest = async (
  currentUserId: string,
  fromUserId: string
) => {
  await deleteDoc(doc(db, 'users', currentUserId, 'connectionRequests', fromUserId));
};
