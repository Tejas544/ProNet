// App.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { socket } from './utils/socket';

// Pages and Layout
import LandingPage from './pages/LandingPage';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import PremiumPage from './pages/PremiumPage';
import SearchPage from './pages/SearchPage';
import CreatePage from './pages/CreatePage';

// State and Hooks
import { useUserStore } from './stores/useUserStore';
import { useTheme } from './hooks/useTheme';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export default function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [theme, toggleTheme] = useTheme('dark');
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  const setUser = useUserStore((state) => state.setUser);
  const currentUser = useUserStore((state) => state.user);

  // Effect 1: Handle Firebase Auth State and Join Socket Room
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser({ uid: user.uid, name: userData.name, email: user.email ?? '' });

          // Centralized 'join_room'. This is the ONLY place we need it.
          socket.connect(); // Ensure the socket is connected
          socket.emit('join_room', user.uid);

        } else {
          setUser(null);
          socket.disconnect();
        }
      } else {
        setUser(null);
        socket.disconnect();
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  // Effect 2: Global listener for incoming messages to show notifications
  useEffect(() => {
    const handleBackgroundMessage = (msg: Message) => {
      // Only increment count if the user is NOT on the chat page
      if (!location.pathname.startsWith('/chat')) {
        console.log('📩 New message for notification badge:', msg);
        setUnreadCount((prev) => prev + 1);
        // Here you can also trigger a browser notification or a toast
      }
    };
  
    socket.on('receive_message', handleBackgroundMessage);
  
    return () => {
      socket.off('receive_message', handleBackgroundMessage);
    };
  }, [location.pathname]);

  // Effect 3: Reset unread count when navigating to the main chat page
  useEffect(() => {
    if (location.pathname.startsWith('/chat')) {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <LandingPage />;
  }

  // FIXED: All required props are now passed to MainLayout
  return (
    <MainLayout
      onLogout={() => auth.signOut()}
      theme={theme}
      toggleTheme={toggleTheme}
      unreadCount={unreadCount}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:userId" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </MainLayout>
  );
}
