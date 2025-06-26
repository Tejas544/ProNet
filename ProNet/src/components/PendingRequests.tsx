import React from 'react';
import { useConnectionRequests } from '../hooks/useConnectionRequests';
import { useUserStore } from '../stores/useUserStore';

export default function PendingRequests() {
  const currentUser = useUserStore((state) => state.user);
  const {
    requests,
    loading,
    acceptRequest,
    rejectRequest,
  } = useConnectionRequests(currentUser?.uid || '');

  if (!currentUser) return <p>Loading user...</p>;
  if (loading) return <p className="text-gray-500">Loading requests...</p>;
  if (!requests.length) return <p className="text-gray-500">No pending requests.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Pending Requests</h2>
      {requests.map((req) => (
        <div
          key={req.id}
          className="border rounded p-3 flex justify-between items-center dark:border-gray-600"
        >
          <span className="text-sm">{req.fromName || req.from}</span>
          <div className="space-x-2">
            <button
              onClick={() => acceptRequest(req.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Accept
            </button>
            <button
              onClick={() => rejectRequest(req.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
