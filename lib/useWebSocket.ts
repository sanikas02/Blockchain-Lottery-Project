import { useState, useEffect, useCallback } from 'react';

interface RoomUpdate {
  type: string;
  roomId?: string;
  players?: any[];
  playerCount?: number;
  finalized?: boolean;
  winner?: string;
  message?: string;
}

export function useWebSocket(roomId: string | null) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [roomData, setRoomData] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [gameFinalized, setGameFinalized] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const sendMessage = useCallback(
    (message: RoomUpdate, userAddress?: string, username?: string) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            ...message,
            roomId,
            userAddress,
            username,
          })
        );
      }
    },
    [ws, roomId]
  );

  const createRoom = useCallback(
    (userAddress: string, username: string) => {
      sendMessage({ type: 'CREATE_ROOM' }, userAddress, username);
    },
    [sendMessage]
  );

  const joinRoom = useCallback(
    (userAddress: string, username: string) => {
      sendMessage({ type: 'JOIN_ROOM' }, userAddress, username);
    },
    [sendMessage]
  );

  const getRoomState = useCallback(() => {
    sendMessage({ type: 'GET_ROOM_STATE' });
  }, [sendMessage]);

  const finalizeGame = useCallback(() => {
    sendMessage({ type: 'FINALIZE_GAME' });
  }, [sendMessage]);

  useEffect(() => {
    if (!roomId) return;

    // Try to establish WebSocket connection (optional - game works without it)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    try {
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log('WebSocket connected (optional real-time updates)');
        setConnected(true);
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.debug('Failed to parse WebSocket message:', error);
        }
      };

      websocket.onerror = (event: Event) => {
        console.debug('WebSocket not available - game will read from blockchain instead');
        setConnected(false);
      };

      websocket.onclose = () => {
        console.debug('WebSocket disconnected');
        setConnected(false);
      };

      setWs(websocket);

      return () => {
        try {
          websocket.close();
        } catch (e) {
          // Ignore errors on close
        }
      };
    } catch (error) {
      console.debug('WebSocket disabled for development - using blockchain for state');
      // WebSocket not available - this is OK, game works without it
    }
  }, [roomId]);

  const handleWebSocketMessage = (message: RoomUpdate) => {
    switch (message.type) {
      case 'ROOM_CREATED':
      case 'JOINED_ROOM':
      case 'ROOM_UPDATE':
      case 'READY_TO_FINALIZE':
        setPlayers(message.players || []);
        setRoomData({
          roomId: message.roomId,
          playerCount: message.playerCount,
          finalized: message.finalized,
        });
        break;

      case 'GAME_FINALIZED':
        setGameFinalized(true);
        setWinner(message.winner || null);
        break;

      case 'ERROR':
        console.error('WebSocket error:', message.message);
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  };

  return {
    connected,
    roomData,
    players,
    gameFinalized,
    winner,
    sendMessage,
    createRoom,
    joinRoom,
    getRoomState,
    finalizeGame,
  };
}
