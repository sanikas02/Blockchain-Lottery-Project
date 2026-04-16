'use client';

import { useState } from 'react';

interface CreateRoomModalProps {
  onClose: () => void;
  onSubmit: (roomId: string) => void;
}

export default function CreateRoomModal({ onClose, onSubmit }: CreateRoomModalProps) {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!roomId.trim()) {
      setError('Room ID is required');
      return;
    }

    if (roomId.length !== 4) {
      setError('Room ID must be exactly 4 characters');
      return;
    }

    if (!/^\d+$/.test(roomId)) {
      setError('Room ID must contain only digits');
      return;
    }

    onSubmit(roomId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-purple-900/80 to-black/80 border border-purple-500/30 rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-2">Create New Room</h2>
        <p className="text-gray-400 mb-6">Enter a 4-digit room ID for your game</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Room ID (4 digits)</label>
            <input
              type="text"
              maxLength={4}
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              placeholder="e.g., 1234"
              className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 text-center text-2xl tracking-widest"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6 text-sm text-gray-300">
            <p className="font-semibold text-white mb-2">When you create a room:</p>
            <ul className="space-y-1 text-xs">
              <li>✓ You stake 0.01 Sepolia ETH</li>
              <li>✓ You become the room creator</li>
              <li>✓ Up to 3 more players can join</li>
              <li>✓ Once full, game finalizes automatically</li>
              <li>✓ Winner gets 0.04 Sepolia ETH</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
