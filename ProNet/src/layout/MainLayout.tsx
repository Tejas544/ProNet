// mainlayout.tsx
import React from 'react';
import Navbar from '../components/Navbar';
// No need to import SunIcon, MoonIcon here anymore if the button is removed

interface MainLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  unreadCount: number;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  onLogout,
  theme,
  toggleTheme,
  unreadCount,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* The theme toggle button here is now redundant as Navbar already has one.
        Remove this block:
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <SunIcon className="w-6 h-6" />
        ) : (
          <MoonIcon className="w-6 h-6" />
        )}
      </button> 
      */}

      {/* 🔗 Navbar */}
      <Navbar
        onLogout={onLogout}
        unreadCount={unreadCount}
        toggleTheme={toggleTheme}
        theme={theme}
      />

      <main className="p-4">{children}</main>
    </div>
  );
};

export default MainLayout;