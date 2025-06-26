import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import HomePage from '../pages/HomePage';
import ChatPage from '../pages/ChatPage';
import ProfilePage from '../pages/ProfilePage';
import PremiumPage from '../pages/PremiumPage';
import SearchPage from '../pages/SearchPage';
import CreatePage from '../pages/CreatePage';

interface Props {
  isLoggedIn: boolean;
}

export default function AppRoutes({ isLoggedIn }: Props) {
  if (!isLoggedIn) {
    return <LandingPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/premium" element={<PremiumPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}
