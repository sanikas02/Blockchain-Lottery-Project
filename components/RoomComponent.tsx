'use client';

import { useState, useEffect } from 'react';

interface RoomComponentProps {
  roomId: string;
  onLeaveRoom: () => void;
  web3: any;
  websocket: any;
  username: string;
}

export default function RoomComponent({
  roomId,
  onLeaveRoom,
  web3,
  websocket,
  username,
}: RoomComponentProps) {
  const [players, setPlayers] = useState<any[]>([]);
  const [gameFinalized, setGameFinalized] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [finalizing, setFinalizing] = useState(false);

  // Debug: Log component render and web3 state
  console.log('RoomComponent rendered with:', {
    roomId,
    web3Contract: web3?.contract ? 'EXISTS' : 'MISSING',
    web3Account: web3?.account,
    username
  });

  useEffect(() => {
    // Fetch room details from blockchain
    const fetchRoomDetails = async () => {
      try {
        if (!roomId) {
          console.warn('No room ID provided');
          return;
        }
        
        const details = await web3.getRoomDetails(roomId);
        console.log('Room details fetched:', {
          roomId: details.roomId,
          playerCount: details.playerCount,
          players: details.players,
          isFinalized: details.isFinalized,
          winner: details.winner
        });
        
        setPlayers(details.players || []);
        setGameFinalized(details.isFinalized);
        if (details.winner) {
          setWinner(details.winner);
        }
      } catch (error) {
        console.error('Failed to fetch room details:', error);
      }
    };

    if (web3.contract) {
      console.log('Fetching room details for:', roomId);
      fetchRoomDetails(); // Initial fetch
      
      // Poll for updates every 3 seconds
      const interval = setInterval(fetchRoomDetails, 3000);
      
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [roomId, web3]);

  useEffect(() => {
    // Listen to WebSocket updates
    if (websocket.roomData) {
      setPlayers(websocket.players || []);
      setGameFinalized(websocket.gameFinalized);
      if (websocket.winner) {
        setWinner(websocket.winner);
      }
    }
  }, [websocket.roomData, websocket.players, websocket.gameFinalized, websocket.winner]);

  const handleFinalize = async () => {
    try {
      setFinalizing(true);
      await web3.finalizeGame(roomId);
    } catch (error) {
      alert('Failed to finalize game: ' + (error as Error).message);
    } finally {
      setFinalizing(false);
    }
  };

  const isCurrentPlayerWinner = winner && web3.account && winner.toLowerCase() === web3.account.toLowerCase();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Room Header */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl p-8 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Room: {roomId}</h2>
            <p className="text-gray-300">Join with 4 players to play</p>
          </div>
          <button
            onClick={onLeaveRoom}
            className="px-4 py-2 bg-red-600/50 hover:bg-red-600/70 text-white rounded-lg transition-all"
          >
            Leave Room
          </button>
        </div>

        {/* Player Count */}
        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          {players.length} / 4 Players
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {players.map((player, index) => {
          // Handle both string addresses and objects
          const playerAddress = typeof player === 'string' ? player : player.address;
          const isCurrentWinner = winner && playerAddress?.toLowerCase() === winner.toLowerCase();
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                isCurrentWinner
                  ? 'border-yellow-400/60 bg-yellow-500/10 shadow-lg shadow-yellow-500/20'
                  : 'border-purple-400/30 bg-purple-500/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{isCurrentWinner ? '👑' : '👤'}</div>
                <div className="flex-1">
                  <p className="font-semibold text-white truncate">Player {index + 1}</p>
                  <p className="text-xs text-gray-400 truncate">{playerAddress}</p>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-gray-300">Stake: </span>
                <span className="text-green-400 font-semibold">0.01 Sepolia ETH</span>
              </div>
            </div>
          );
        })}

        {/* Empty Slots */}
        {[...Array(Math.max(0, 4 - players.length))].map((_, index) => (
          <div
            key={`empty-${index}`}
            className="p-4 rounded-lg border-2 border-dashed border-gray-600 bg-gray-900/30 flex items-center justify-center min-h-32"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🔒</div>
              <p className="text-gray-400">Waiting for player...</p>
            </div>
          </div>
        ))}
      </div>

      {/* Game Status */}
      {!gameFinalized && players.length < 4 && (
        <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 mb-8 text-center">
          <p className="text-blue-300">Waiting for more players to join...</p>
          <p className="text-sm text-gray-400 mt-1">Share the room ID: <span className="font-mono font-semibold text-blue-400">{roomId}</span></p>
        </div>
      )}

      {!gameFinalized && players.length === 4 && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-6 mb-8 text-center">
          <p className="text-green-300 text-lg font-semibold mb-4">All players ready! Game time! 🎮</p>
          <button
            onClick={handleFinalize}
            disabled={finalizing}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {finalizing ? 'Processing...' : '🎲 Draw Winner'}
          </button>
        </div>
      )}

      {/* Winner Display */}
      {gameFinalized && winner && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-3xl font-bold text-yellow-300 mb-2">Winner!</h3>
          <p className="text-gray-300 mb-4">
            {isCurrentPlayerWinner ? 'Congratulations! You won!' : 'Better luck next time!'}
          </p>
          <div className="bg-black/30 rounded p-4 mb-4">
            <p className="text-sm text-gray-400 mb-1">Winner Address:</p>
            <p className="font-mono text-yellow-300 break-all">{winner}</p>
          </div>
          <div className="text-xl font-semibold text-yellow-300 mb-4">
            Prize: 0.04 Sepolia ETH 💰
          </div>
          <button
            onClick={onLeaveRoom}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
