'use client';

import { useState } from 'react';

interface JoinRoomModalProps {
  onClose: () => void;
  onSubmit: (roomId: string) => void;
}

export default function JoinRoomModal({ onClose, onSubmit }: JoinRoomModalProps) {
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
      <div className="bg-gradient-to-b from-blue-900/80 to-black/80 border border-blue-500/30 rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-2">Join a Room</h2>
        <p className="text-gray-400 mb-6">Enter the 4-digit room ID to join</p>

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
              className="w-full px-4 py-2 bg-black/50 border border-blue-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-center text-2xl tracking-widest"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6 text-sm text-gray-300">
            <p className="font-semibold text-white mb-2">When you join a room:</p>
            <ul className="space-y-1 text-xs">
              <li>✓ You stake 0.01 Sepolia ETH</li>
              <li>✓ You join existing players</li>
              <li>✓ If you're the 4th person, game starts</li>
              <li>✓ Winning chance: 25% (1 in 4)</li>
              <li>✓ Win: 0.04 Sepolia ETH (4x stake)</li>
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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all"
            >
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
