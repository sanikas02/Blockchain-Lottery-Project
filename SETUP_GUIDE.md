# Blockchain Game Room

A decentralized gaming application built with Next.js, Solidity, and WebSocket for real-time multiplayer gameplay on the Sepolia testnet.

## 🎮 Game Features

- **Create Rooms**: Create a game room with a 4-digit ID
- **Join Rooms**: Join existing rooms using the room ID
- **Staking**: Players stake 0.01 Sepolia ETH per game
- **Winner Selection**: After 4 players join, a random winner is selected
- **Prizes**: Winner receives 0.04 Sepolia ETH (4x the stake)
- **Real-time Updates**: WebSocket for live player updates
- **Basic UI**: Clean, modern interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MetaMask or any Web3 wallet
- Sepolia testnet ETH (for gas fees and staking)

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Deploy the smart contract** (see section below)

3. **Configure environment variables** in `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ABI='[...]'
NEXT_PUBLIC_CONTRACT_ADDRESS='0x...'
NEXT_PUBLIC_SEPOLIA_RPC_URL='https://...'
```

4. **Run the development server**:
```bash
npm run dev
```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Smart Contract Deployment

### Step 1: Prepare the Contract

The Solidity smart contract is located at `contracts/GameRoom.sol`. It includes:

- Room creation with 4-digit IDs
- Player join functionality (max 4 players)
- Stake management (0.01 ETH per player)
- Random winner selection
- Prize distribution (0.04 ETH to winner)

### Step 2: Deploy via Remix IDE

1. **Open Remix**: [https://remix.ethereum.org](https://remix.ethereum.org)

2. **Create new file**: Create `GameRoom.sol` and copy the contract code from `contracts/GameRoom.sol`

3. **Compile**:
   - Go to "Solidity Compiler" tab
   - Select compiler version `0.8.20` or higher
   - Click "Compile GameRoom.sol"

4. **Deploy**:
   - Go to "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask" as environment
   - Make sure you're on **Sepolia testnet** in MetaMask
   - Click "Deploy"
   - Confirm the transaction in MetaMask

5. **Get Contract Details**:
   - After deployment, copy the **Contract Address** (displayed at the bottom)
   - Click the "Copy ABI" icon next to the contract name

### Step 3: Update Environment Variables

1. **Edit `.env.local`**:

```
NEXT_PUBLIC_CONTRACT_ADDRESS='0x...'  # Paste your deployed contract address
NEXT_PUBLIC_CONTRACT_ABI='[...]'      # Paste the ABI from Remix
NEXT_PUBLIC_SEPOLIA_RPC_URL='https://sepolia.infura.io/v3/YOUR_KEY'
```

**Getting the ABI from Remix**:
- After compilation, go to "Solidity Compiler" tab
- Expand the compiled contract
- Click the "Copy ABI" button
- Paste the entire JSON array into `NEXT_PUBLIC_CONTRACT_ABI`

2. **Restart the dev server** to apply environment variables

## 🎯 How to Play

1. **Connect Wallet**:
   - Click "Connect Wallet" button
   - Approve MetaMask connection
   - Ensure you're on Sepolia testnet

2. **Create a Room** (Option A):
   - Click "Create Room" card
   - Enter any 4-digit number (e.g., 1234)
   - Confirm transaction in MetaMask (0.01 ETH stake)
   - Share the room ID with other players

3. **Join a Room** (Option B):
   - Click "Join Room" card
   - Enter the 4-digit room ID
   - Confirm transaction in MetaMask (0.01 ETH stake)
   - Wait for 4 players to join

4. **Game Finalization**:
   - Once 4 players join, click "🎲 Draw Winner"
   - Smart contract selects a random winner
   - Winner receives 0.04 Sepolia ETH

## 💰 Tokenomics

| Item | Value |
|------|-------|
| Stake per player | 0.01 Sepolia ETH |
| Total pool (4 players) | 0.04 Sepolia ETH |
| Prize to winner | 0.04 Sepolia ETH |
| Win probability | 1 in 4 (25%) |

## 🔧 Project Structure

```
.
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Layout wrapper
│   └── globals.css           # Global styles
├── components/
│   ├── RoomComponent.tsx     # Room display and player list
│   ├── CreateRoomModal.tsx   # Create room form
│   └── JoinRoomModal.tsx     # Join room form
├── lib/
│   ├── config.ts            # Environment config
│   ├── useWeb3.ts           # Web3 and contract hooks
│   ├── useWebSocket.ts      # WebSocket real-time updates
│   └── websocket.ts         # WebSocket server logic
├── contracts/
│   └── GameRoom.sol         # Solidity smart contract
└── .env.local               # Environment variables
```

## 🔗 Smart Contract Methods

### Create Room
```solidity
createRoom(string memory _roomId) public payable
```
- Requires: 0.01 ETH stake
- Creates new game room with given 4-digit ID
- Emits: `RoomCreated` event

### Join Room
```solidity
joinRoom(string memory _roomId) public payable
```
- Requires: 0.01 ETH stake
- Adds player to room (max 4)
- Auto-finalizes when 4th player joins
- Emits: `PlayerJoined` event

### Finalize Game
```solidity
finalizeGame(string memory _roomId) public
```
- Selects random winner
- Transfers 0.04 ETH to winner
- Emits: `GameFinalized` event

### Get Room Details
```solidity
getRoomDetails(string memory _roomId) public view returns (...)
```
- Returns: room ID, players, count, finalized status, winner, creation time

## 🧪 Testing

### Test with Different Wallets

1. **Create room** with Wallet A
2. **Join room** with Wallets B, C, D
3. After 4 players, game auto-finalizes
4. Check Sepolia Etherscan to verify transactions

### Test Networks

- **Sepolia Testnet**: https://sepolia.etherscan.io
- Get testnet ETH from: https://sepoliafaucet.com

## ⚠️ Important Notes

1. **Testnet Only**: This is deployed on Sepolia testnet, not mainnet
2. **Gas Fees**: You need Sepolia ETH for transactions and gas
3. **Security**: This is a demo project. For production, add:
   - Input validation enhancements
   - Access controls for sensitive functions
   - Rate limiting for WebSocket
   - Secure random number generation
   - Audit by professional security team

## 🐛 Troubleshooting

### "Contract not initialized"
- Ensure `.env.local` has correct `NEXT_PUBLIC_CONTRACT_ADDRESS` and `NEXT_PUBLIC_CONTRACT_ABI`
- Restart the development server after updating `.env.local`

### "Incorrect stake amount"
- Ensure you're staking exactly 0.01 Sepolia ETH
- Check transaction details in MetaMask

### "Room is full"
- The room already has 4 players
- Create a new room or join a different one

### "Network mismatch"
- Ensure MetaMask is set to Sepolia testnet
- Network ID for Sepolia: 11155111

## 📚 Resources

- [Remix IDE Documentation](https://remix-ide.readthedocs.io/)
- [ethers.js Documentation](https://docs.ethers.org/)
- [Sepolia Testnet Guide](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 📄 License

MIT License - feel free to use for educational purposes

## 🎓 Built With

- **Frontend**: Next.js 16 + TypeScript + React 19 + Tailwind CSS
- **Blockchain**: Solidity 0.8.20 + ethers.js
- **Real-time**: WebSocket for live updates
- **Styling**: Tailwind CSS with gradient effects
