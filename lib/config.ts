// Environment variables setup
// This file loads environment variables from .env.local

export const CONTRACT_ABI = JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI || '[]');
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
export const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';

// Validate that required variables are set
if (!CONTRACT_ADDRESS) {
  console.warn('CONTRACT_ADDRESS not set in environment variables');
}

if (CONTRACT_ABI.length === 0) {
  console.warn('CONTRACT_ABI not set in environment variables');
}
