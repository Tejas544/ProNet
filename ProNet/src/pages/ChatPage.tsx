import React, { useState, useEffect } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { collection, getDocs, getDoc, doc as docRef } from 'firebase/firestore';
import { db } from '../firebase/config';
import { socket } from '../utils/socket'; // Make sure you export your socket instance
import ChatWindow from '../components/ChatWindow';

interface ConnectedUser {
  id: string;
  name: string;
  email: string;
}

export default function ChatPage() {
  const currentUser = useUserStore((state) => state.user);
  const [connections, setConnections] = useState<ConnectedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ConnectedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ CRUCIAL FIX: This effect ensures the user joins their personal
  // socket room as soon as they are authenticated.
  useEffect(() => {
    if (!currentUser?.uid) return;

    const joinRoom = () => {
      // The client tells the server which room (named after its UID) to join.
      socket.emit('join_room', currentUser.uid);
    };

    // If the socket is already connected when this component mounts, join immediately.
    if (socket.connected) {
      joinRoom();
    } else {
      // Otherwise, wait for the 'connect' event to fire before joining.
      socket.on('connect', joinRoom);
    }

    // Clean up the event listener on component unmount to prevent memory leaks.
    return () => {
      socket.off('connect', joinRoom);
    };
  }, [currentUser]);

  // This effect fetches the user's connections from Firestore.
  useEffect(() => {
    if (!currentUser) return;

    const fetchConnections = async () => {
      try {
        setLoading(true);
        const connRef = collection(db, 'users', currentUser.uid, 'connections');
        const snapshot = await getDocs(connRef);

        const fetched = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const userDoc = await getDoc(docRef(db, 'users', docSnap.id));
            const userData = userDoc.exists() ? userDoc.data() : null;

            return {
              id: docSnap.id,
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
  }, [currentUser]);

  if (!currentUser) return <p>Loading user...</p>;

  return (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Sidebar: Connections */}
      <div className="w-64 border-r dark:border-gray-700 p-4 space-y-2 overflow-y-auto">
        <h2 className="font-semibold mb-2">Your Connections</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading connections...</p>
        ) : connections.length === 0 ? (
          <p className="text-sm text-gray-500">No connections yet.</p>
        ) : (
          connections.map((conn) => (
            <button
              key={conn.id}
              onClick={() => setSelectedUser(conn)}
              className={`block w-full text-left p-2 rounded ${
                selectedUser?.id === conn.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {conn.name}
            </button>
          ))
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 p-4">
        {selectedUser ? (
          <ChatWindow selectedUser={selectedUser} />
        ) : (
          <p className="text-gray-500 text-center mt-10">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
}
