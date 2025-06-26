import { auth, db } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  setDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

// 👤 Signup and also add user to Firestore
export const signup = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // ✅ Store user in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    id: user.uid,
    email: user.email,
    name, // ✅ Use provided name
    createdAt: serverTimestamp(),
  });

  return user;
};

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const listenToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
