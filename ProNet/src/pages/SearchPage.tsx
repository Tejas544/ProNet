import React, { useState } from 'react';
import { useConnections } from '../hooks/useConnections';
import { useUserStore } from '../stores/useUserStore';
import PendingRequests from '../components/PendingRequests';

export default function SearchPage() {
  const currentUser = useUserStore((state) => state.user);
  const [input, setInput] = useState('');

  if (!currentUser) return <p className="text-center text-gray-500">Loading user...</p>;

  const { results, search, sendRequest, loading, error } = useConnections(currentUser.uid);

  const handleSearch = () => {
    if (input.trim()) search(input.trim());
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      {/* 🔍 Search Section */}
      <div>
        <h1 className="text-2xl font-semibold mb-4">Find People</h1>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 border rounded-l dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-gray-600 dark:text-gray-300">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <ul>
          {results.map((user) => (
            <li
              key={user.id}
              className="mb-2 p-2 border rounded flex justify-between items-center dark:border-gray-700"
            >
              <span>{user.name || 'Unnamed User'}</span>
              <button
                onClick={() => sendRequest(user.id)}
                className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Connect
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔔 Pending Requests Section */}
      <div>
        <PendingRequests />
      </div>
    </div>
  );
}
