import { useState, useCallback, useEffect } from 'react';
import { BrowserProvider, Contract, parseEther } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';

// Declare window.ethereum property for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface ContractData {
  playerCount: number;
  roomDetails: any;
  isPlayerInRoom: boolean;
  winner: string | null;
}

// Helper function to check if MetaMask/Web3 provider exists
const isMetaMaskAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.ethereum;
};

// Get the Ethereum provider if available
const getEthereumProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return window.ethereum;
  }
  return null;
};

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize provider on client side only
  useEffect(() => {
    if (!isMetaMaskAvailable()) {
      console.warn('MetaMask not available for initialization');
      return;
    }

    const initProvider = async () => {
      try {
        if (!CONTRACT_ADDRESS) {
          console.error('CONTRACT_ADDRESS not configured in environment variables');
          return;
        }

        const ethereumProvider = getEthereumProvider();
        if (!ethereumProvider) {
          console.error('Ethereum provider not found');
          return;
        }

        const browserProvider = new BrowserProvider(ethereumProvider);
        setProvider(browserProvider);

        // Check if already connected
        const accounts = await browserProvider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          const userSigner = await browserProvider.getSigner();
          setSigner(userSigner);
          
          // Create contract with the signer
          const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, userSigner);
          setContract(contractInstance);
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Failed to initialize provider:', err);
      }
    };

    initProvider();
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate MetaMask is available
      if (!isMetaMaskAvailable()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Validate configuration
      if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured. Check your .env.local file.');
      }

      if (!CONTRACT_ABI || CONTRACT_ABI.length === 0) {
        throw new Error('Contract ABI not configured. Check your .env.local file.');
      }

      const ethereumProvider = getEthereumProvider();
      if (!ethereumProvider) {
        throw new Error('Ethereum provider not found');
      }

      const browserProvider = new BrowserProvider(ethereumProvider);
      const accounts = await browserProvider.send('eth_requestAccounts', []);

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const userAccount = accounts[0];
      setAccount(userAccount);

      // Get signer and create contract instance
      const userSigner = await browserProvider.getSigner();
      setSigner(userSigner);
      setProvider(browserProvider);

      // Create contract with the signer for sending transactions
      const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, userSigner);
      setContract(contractInstance);    
      setIsConnected(true);

      return userAccount;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoom = useCallback(
    async (roomId: string) => {
      try {
        setLoading(true);
        setError(null);

        if (!contract) {
          throw new Error('Contract not initialized');
        }

        if (!roomId || roomId.length !== 4) {
          throw new Error('Room ID must be 4 characters');
        }

        const stakeAmount = parseEther('0.01');
        const tx = await contract.createRoom(roomId, { value: stakeAmount });
        await tx.wait();

        return tx.hash;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to create room';
        setError(errorMessage);
        console.error('Create room error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contract]
  );

  const joinRoom = useCallback(
    async (roomId: string) => {
      try {
        setLoading(true);
        setError(null);

        if (!contract) {
          throw new Error('Contract not initialized');
        }

        const stakeAmount = parseEther('0.01');
        const tx = await contract.joinRoom(roomId, { value: stakeAmount });
        await tx.wait();

        return tx.hash;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to join room';
        setError(errorMessage);
        console.error('Join room error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contract]
  );

  const getRoomDetails = useCallback(
    async (roomId: string) => {
      try {
        if (!contract) {
          throw new Error('Contract not initialized');
        }

        console.log('Calling getRoomDetails with roomId:', roomId);
        const details = await contract.getRoomDetails(roomId);
        console.log('Raw contract response:', details);
        
        const result = {
          roomId: details.roomId,
          players: details.players,
          playerCount: Number(details.playerCount),
          isFinalized: details.isFinalized,
          winner: details.winner !== '0x0000000000000000000000000000000000000000' ? details.winner : null,
          createdAt: Number(details.createdAt),
        };
        
        console.log('Processed room details:', result);
        return result;
      } catch (err: any) {
        console.error('Get room details error:', err);
        throw err;
      }
    },
    [contract]
  );

  const getPlayerCount = useCallback(
    async (roomId: string) => {
      try {
        if (!contract) {
          throw new Error('Contract not initialized');
        }

        const count = await contract.getPlayerCount(roomId);
        return Number(count);
      } catch (err: any) {
        console.error('Get player count error:', err);
        throw err;
      }
    },
    [contract]
  );

  const getRoomWinner = useCallback(
    async (roomId: string) => {
      try {
        if (!contract) {
          throw new Error('Contract not initialized');
        }

        const winner = await contract.getRoomWinner(roomId);
        return winner !== '0x0000000000000000000000000000000000000000' ? winner : null;
      } catch (err: any) {
        console.error('Get room winner error:', err);
        throw err;
      }
    },
    [contract]
  );

  const finalizeGame = useCallback(
    async (roomId: string) => {
      try {
        setLoading(true);
        setError(null);

        if (!contract) {
          throw new Error('Contract not initialized');
        }

        const tx = await contract.finalizeGame(roomId);
        await tx.wait();

        return tx.hash;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to finalize game';
        setError(errorMessage);
        console.error('Finalize game error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contract]
  );

  return {
    account,
    contract,
    provider,
    isConnected,
    loading,
    error,
    connectWallet,
    createRoom,
    joinRoom,
    getRoomDetails,
    getPlayerCount,
    getRoomWinner,
    finalizeGame,
  };
}
