'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/lib/useWeb3';
import { useWebSocket } from '@/lib/useWebSocket';
import RoomComponent from '@/components/RoomComponent';
import CreateRoomModal from '@/components/CreateRoomModal';
import JoinRoomModal from '@/components/JoinRoomModal';

export default function Home() {
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [username, setUsername] = useState('Player');

  const web3 = useWeb3();
  const websocket = useWebSocket(currentRoomId);

  useEffect(() => {
    // Set username from account if available
    if (web3.account) {
      setUsername(`${web3.account.slice(0, 6)}...${web3.account.slice(-4)}`);
    }
  }, [web3.account]);

  const handleCreateRoom = async (roomId: string) => {
    try {
      if (!web3.isConnected) {
        alert('Please connect your wallet first');
        return;
      }

      // Create on blockchain
      await web3.createRoom(roomId);

      // Create on WebSocket
      websocket.createRoom(web3.account || '', username);

      setCurrentRoomId(roomId);
      setShowCreateModal(false);
    } catch (error) {
      alert('Failed to create room: ' + (error as Error).message);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      if (!web3.isConnected) {
        alert('Please connect your wallet first');
        return;
      }

      // Join on blockchain
      await web3.joinRoom(roomId);

      // Join on WebSocket
      websocket.joinRoom(web3.account || '', username);

      setCurrentRoomId(roomId);
      setShowJoinModal(false);
    } catch (error) {
      alert('Failed to join room: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                ⛓️ Blockchain Game Room
              </h1>
              <p className="text-gray-400 text-sm mt-1">Stake 0.01 Sepolia ETH to win 0.04!</p>
            </div>
            <button
              onClick={web3.connectWallet}
              disabled={web3.isConnected}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                web3.isConnected
                  ? 'bg-green-600/20 text-green-400 border border-green-500/50'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {web3.isConnected ? `✓ ${web3.account?.slice(0, 10)}...` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!currentRoomId ? (
          // No room selected - show buttons
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mt-16">
            {/* Create Room Card */}
            <div className="group cursor-pointer" onClick={() => setShowCreateModal(true)}>
              <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-8 hover:border-purple-400/60 transition-all hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1">
                <div className="text-5xl mb-4">🎮</div>
                <h2 className="text-2xl font-bold text-purple-200 mb-2">Create Room</h2>
                <p className="text-gray-400 mb-4">Create a new game room with a 4-digit ID</p>
                <div className="text-sm text-purple-300">
                  • Stake: 0.01 Sepolia ETH
                  <br />
                  • Prize: 0.04 Sepolia ETH
                </div>
              </div>
            </div>

            {/* Join Room Card */}
            <div className="group cursor-pointer" onClick={() => setShowJoinModal(true)}>
              <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-8 hover:border-blue-400/60 transition-all hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1">
                <div className="text-5xl mb-4">👥</div>
                <h2 className="text-2xl font-bold text-blue-200 mb-2">Join Room</h2>
                <p className="text-gray-400 mb-4">Join an existing game room</p>
                <div className="text-sm text-blue-300">
                  • Max: 4 Players
                  <br />
                  • Instant: Play now!
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Room selected - show room component
          <RoomComponent
            roomId={currentRoomId}
            onLeaveRoom={() => setCurrentRoomId(null)}
            web3={web3}
            websocket={websocket}
            username={username}
          />
        )}
      </main>

      {/* Modals */}
      {showCreateModal && <CreateRoomModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreateRoom} />}
      {showJoinModal && <JoinRoomModal onClose={() => setShowJoinModal(false)} onSubmit={handleJoinRoom} />}

      {/* Error Display */}
      {web3.error && (
        <div className="fixed bottom-4 right-4 bg-red-600/90 text-white px-6 py-4 rounded-lg backdrop-blur-md max-w-sm">
          <p className="font-semibold">Error</p>
          <p className="text-sm text-gray-200">{web3.error}</p>
        </div>
      )}
    </div>
  );
}
