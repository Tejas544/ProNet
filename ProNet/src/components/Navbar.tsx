import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from './Button';
import { SunIcon, MoonIcon } from './Icons';

interface NavbarProps {
  onLogout: () => void;
  unreadCount: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Search', path: '/search' },
  { label: 'Chat', path: '/chat' },
  { label: 'Create', path: '/create' },
  { label: 'Premium', path: '/premium' },
  { label: 'Profile', path: '/profile' },
];

const Navbar: React.FC<NavbarProps> = ({
  onLogout,
  unreadCount,
  theme,
  toggleTheme,
}) => {
  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* 🔵 Brand */}
          <div className="flex items-center">
            <span className="font-bold text-xl text-blue-600 dark:text-blue-500">
              ProNet
            </span>

            {/* 🔗 Nav Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`
                    }
                  >
                    {item.label}
                    {item.label === 'Chat' && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* 🌗 Theme + Logout */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            <Button onClick={onLogout} variant="secondary" className="text-sm">
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
