import React, { useState } from 'react';
import { login, signup } from '../services/authService';
import Button from './Button';

interface Props {
  onClose: () => void;
}

const SignInUpModal: React.FC<Props> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // ✅ Add name input
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        if (!name.trim()) {
          setError('Name is required');
          return;
        }
        await signup(email, password, name); // ✅ Pass name
      } else {
        await login(email, password);
      }
      onClose(); // ✅ Close modal after auth
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {isSignup ? 'Create Account' : 'Sign In'}
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleSubmit} className="w-full">
          {isSignup ? 'Sign Up' : 'Sign In'}
        </Button>

        <p
          onClick={() => {
            setIsSignup((prev) => !prev);
            setError('');
          }}
          className="mt-4 text-blue-500 cursor-pointer text-sm"
        >
          {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </p>

        <Button onClick={onClose} className="mt-4 text-sm bg-gray-300 text-black">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SignInUpModal;
