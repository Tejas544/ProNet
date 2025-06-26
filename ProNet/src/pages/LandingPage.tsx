import React, { useState } from 'react';
import Button from '../components/Button';
import SignInUpModal from '../components/SignInUpModal';

const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Welcome to ConnectSphere
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
          Your new social universe. Share moments, connect with professionals, and grow your network.
        </p>
        <Button onClick={() => setIsModalOpen(true)} className="px-8 py-3 text-lg">
          Get Started
        </Button>
      </div>

      {isModalOpen && (
        <SignInUpModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default LandingPage;
