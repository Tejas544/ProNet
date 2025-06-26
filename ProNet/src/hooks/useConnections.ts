import { useState } from 'react';
import { searchUsers, sendConnectionRequest } from '../services/userService';

interface User {
  id: string;
  email: string;
  name: string;
  // You can extend this with more fields as needed
}

export const useConnections = (currentUserId: string) => {
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const search = async (keyword: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const users = await searchUsers(keyword, currentUserId);
      setResults(users);
    } catch (err: any) {
      setError(err.message || 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (toUserId: string) => {
    if (toUserId === currentUserId) {
      setError("You can't send a connection request to yourself.");
      return;
    }

    try {
      await sendConnectionRequest(currentUserId, toUserId);
      setSuccessMessage('Connection request sent!');
    } catch (err: any) {
      setError(err.message || 'Failed to send request');
    }
  };

  return {
    results,
    search,
    sendRequest,
    loading,
    error,
    successMessage,
  };
};
