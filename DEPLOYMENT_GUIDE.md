# Complete Deployment Guide

## 🎯 Overview

This guide walks you through deploying your blockchain game room project end-to-end on Sepolia testnet.

---

## Phase 1: Smart Contract Deployment (Remix IDE)

### Step 1: Prepare the Contract

1. **Open Remix IDE**:
   - Go to [https://remix.ethereum.org](https://remix.ethereum.org)
   - You'll see the Remix online IDE

2. **Create Contract File**:
   - Click "File Explorer" (left sidebar)
   - Click "+ New File" button
   - Name it: `GameRoom.sol`
   - Press Enter

3. **Copy Contract Code**:
   - Open `contracts/GameRoom.sol` from your project
   - Copy the entire code
   - Paste into Remix editor

### Step 2: Compile Contract

1. **Go to Compiler Tab**:
   - Click "Solidity Compiler" icon (left sidebar)
   - Shows as "< >" icon

2. **Select Compiler Version**:
   - Change compiler to `0.8.20` or higher
   - If not visible, click dropdown under "VERSION"
   - Select `0.8.20`

3. **Compile**:
   - Click "Compile GameRoom.sol" button
   - Wait for green checkmark (✓) indicating success
   - If errors appear, check code and fix them

### Step 3: Deploy to Sepolia

1. **Switch Network in MetaMask**:
   - Open MetaMask extension
   - Click network dropdown (top center)
   - Search for "Sepolia"
   - Click "Sepolia test network"

2. **Go to Deploy Tab**:
   - In Remix, click "Deploy & Run Transactions" tab
   - Or click the orange icon (📦) on the left

3. **Configure Deployment**:
   - **Environment**: Select "Injected Provider - MetaMask"
   - **Account**: Should show your MetaMask account
   - **Contract**: Select "GameRoom"
   - **Gas**: Leave as default

4. **Deploy**:
   - Click orange "Deploy" button
   - MetaMask popup appears
   - Review transaction details
   - Click "Confirm" to approve

5. **Wait for Confirmation**:
   - Transaction may take 1-2 minutes
   - Watch MetaMask notification
   - Green checkmark = success

### Step 4: Copy Contract Address

1. **Find Deployment Result**:
   - Scroll down in Remix
   - Find "Deployed Contracts" section
   - Your contract address should display (0x...)

2. **Copy Address**:
   - Click copy icon next to address
   - Save it somewhere safe
   - This is your `CONTRACT_ADDRESS`

3. **Verify on Etherscan**:
   - Go to [https://sepolia.etherscan.io](https://sepolia.etherscan.io)
   - Paste contract address in search
   - Should show your contract code

### Step 5: Extract ABI

1. **Go Back to Compiler Tab**:
   - Click "Solidity Compiler" tab
   - Find your compiled contract

2. **Copy ABI**:
   - Find the box with contract details
   - Look for copy icons on the right
   - Click the "Copy ABI" button (overlapping squares icon)
   ```
   [
     {
       "inputs": [...],
       "name": "createRoom",
       ...
     }
   ]
   ```

3. **Save ABI**:
   - Paste into text editor
   - This is your `CONTRACT_ABI`

---

## Phase 2: Configure Environment Variables

### Step 1: Edit .env.local

1. **Open File**:
   - In your project root, open `.env.local`
   - If it doesn't exist, create it

2. **Update Variables**:

```env
# Contract address from Remix deployment (copy exact address)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# ABI copied from Remix (entire JSON array)
NEXT_PUBLIC_CONTRACT_ABI=[{"inputs":[{"internalType":"string","name":"_roomId","type":"string"}],"name":"createRoom","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"_roomId","type":"string"}],"name":"joinRoom","outputs":[],"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"roomId","type":"string"},{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"RoomCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"roomId","type":"string"},{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"playerCount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"PlayerJoined","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"roomId","type":"string"},{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"prizeAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GameFinalized","type":"event"},{"inputs":[{"internalType":"string","name":"_roomId","type":"string"}],"name":"finalizeGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_roomId","type":"string"},{"internalType":"address","name":"_player","type":"address"}],"name":"isPlayerInRoom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_roomId","type":"string"}],"name":"getPlayerCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_roomId","type":"string"}],"name":"getRoomDetails","outputs":[{"internalType":"string","name":"roomId","type":"string"},{"internalType":"address[]","name":"players","type":"address[]"},{"internalType":"uint256","name":"playerCount","type":"uint256"},{"internalType":"bool","name":"isFinalized","type":"bool"},{"internalType":"address","name":"winner","type":"address"},{"internalType":"uint256","name":"createdAt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_roomId","type":"string"}],"name":"getRoomWinner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"address"}]

# Optional: Sepolia RPC URL (has sensible default)
# NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

3. **Save File**:
   - Ctrl+S (Windows) or Cmd+S (Mac)

### Step 2: Prepare Sepolia ETH

1. **Check Balance**:
   - Open MetaMask
   - Ensure on Sepolia network
   - Check balance (need ETH for gas + staking)

2. **Get Testnet ETH** (if needed):
   - Visit [https://sepoliafaucet.com](https://sepoliafaucet.com)
   - OR [https://www.alchemy.com/faucets/ethereum-sepolia](https://www.alchemy.com/faucets/ethereum-sepolia)
   - Follow instructions to get free Sepolia ETH
   - Usually takes a few minutes to arrive

---

## Phase 3: Install & Run Project

### Step 1: Install Dependencies

```bash
# Navigate to project directory
cd blockchain-sem8-project

# Install all packages
npm install
```

Output should show:
```
added X packages
```

### Step 2: Start Development Server

```bash
# Start the dev server
npm run dev
```

Output should show:
```
▲ Next.js 16.2.1
- Local: http://localhost:3000
```

### Step 3: Open in Browser

1. **Open Browser**:
   - Go to http://localhost:3000
   - You should see the game room interface

2. **Expected Screen**:
   - Header with "⛓️ Blockchain Game Room"
   - "Connect Wallet" button (top right)
   - Two cards: "Create Room" and "Join Room"

---

## Phase 4: Test the Game

### Test 1: Connect Wallet

1. **Click "Connect Wallet"**:
   - MetaMask popup appears
   - Shows account to connect
   - Click "Connect"

2. **Approval**:
   - Click "Approve" in MetaMask
   - Button changes to show connected account
   - Example: "✓ 0x1234...5678"

### Test 2: Create Room

1. **Click "Create Room" Card**:
   - Modal dialog appears
   - Text field for room ID

2. **Enter Room ID**:
   - Type any 4 digits: e.g., "1234"
   - Only numbers allowed

3. **Create Room**:
   - Click "Create Room" button
   - MetaMask shows transaction
   - Stake: 0.01 ETH
   - Gas fee: ~0.002 ETH (varies)

4. **Confirm**:
   - Click "Confirm" in MetaMask
   - Wait 1-2 minutes for mining

5. **Result**:
   - Game room displays with your address
   - Shows "1 / 4 Players"
   - Room ID: 1234

### Test 3: Join Room (with Different Account)

1. **Switch MetaMask Account**:
   - In MetaMask, click account selector
   - Create or switch to Account 2

2. **Refresh Browser** (http://localhost:3000):
   - Now connected with different account

3. **Click "Join Room" Card**:
   - Modal appears

4. **Enter Room ID**:
   - Type: "1234" (same room created before)
   - Click "Join Room"

5. **Confirm**:
   - Stake: 0.01 ETH
   - Click "Confirm" in MetaMask

6. **Result**:
   - Room shows "2 / 4 Players"
   - Both players visible

### Test 4: Fill Room (4 Players)

1. Repeat "Test 3" with Account 3
2. Repeat "Test 3" with Account 4
3. When 4th player joins:
   - Room shows "4 / 4 Players"
   - "Draw Winner" button appears
   - Total pool shown: 0.04 ETH

### Test 5: Draw Winner

1. **Click "🎲 Draw Winner" Button**:
   - Smart contract runs
   - Picks random winner
   - Transfers prize: 0.04 ETH

2. **Result**:
   - Trophy (🏆) appears
   - Winner address displayed
   - "Back to Home" button shows

3. **Verify**:
   - Check MetaMask, one account has +0.04 ETH
   - (Actually 0.04 - 0.01 stake + 0.04 prize = +0.03)

### Test 6: Check Transactions on Etherscan

1. **Open Etherscan**:
   - Go to [https://sepolia.etherscan.io](https://sepolia.etherscan.io)

2. **Search for Contract**:
   - Paste your contract address
   - View all transactions

3. **Verify Functions**:
   - See `createRoom` calls
   - See `joinRoom` calls  
   - See `finalizeGame` call

---

## Troubleshooting

### Problem: "Contract not initialized"

**Cause**: Wrong contract address or ABI in `.env.local`

**Fix**:
1. Double-check contract address from Remix (0x...)
2. Double-check ABI is full JSON array
3. Restart dev server: `npm run dev`

### Problem: "Incorrect stake amount"

**Cause**: Staking wrong amount (not 0.01 ETH)

**Fix**:
1. Check MetaMask transaction details
2. Ensure you're staking exactly 0.01 Sepolia ETH
3. If showing 10, that's Wei, should be 0.01 ETH

### Problem: "Room is full"

**Cause**: Already 4 players in room

**Fix**:
1. Create new room with different ID
2. Or wait for room to be deleted
3. Try room ID like "5678"

### Problem: "MetaMask not connecting"

**Cause**: Not on Sepolia network

**Fix**:
1. Open MetaMask
2. Click network dropdown (top center)
3. Select "Sepolia test network"
4. Refresh browser page

### Problem: "No balance"

**Cause**: No Sepolia ETH

**Fix**:
1. Get free testnet ETH from faucet:
   - [Sepolia Faucet](https://sepoliafaucet.com)
   - [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
2. Wait 5-10 minutes for ETH to arrive
3. Refresh MetaMask

---

## Advanced: Production Deployment

### Option 1: Vercel Hosting

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Self-Hosted

For production, update WebSocket handling:

```javascript
// Use Socket.io or ws library for production
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });
wss.on('connection', (ws) => {
  // Handle connections
});
```

### Mainnet Deployment

To go to mainnet:
1. Redeploy contract to Ethereum mainnet (costs real ETH)
2. Update `.env.local` with mainnet RPC
3. Update documentation
4. Verify on Etherscan mainnet
5. Add security audit

---

## ✅ Verification Checklist

- [ ] Contract deployed to Sepolia
- [ ] Contract address saved
- [ ] ABI extracted from Remix
- [ ] `.env.local` configured
- [ ] Development server running
- [ ] MetaMask can connect
- [ ] Have Sepolia ETH
- [ ] Can create room
- [ ] Can join room
- [ ] Can fill room (4 players)
- [ ] Can draw winner
- [ ] Winner receives prize
- [ ] Transactions visible on Etherscan

---

## 📞 Quick Links

| Resource | Link |
|----------|------|
| Remix IDE | [remix.ethereum.org](https://remix.ethereum.org) |
| Sepolia Faucet | [sepoliafaucet.com](https://sepoliafaucet.com) |
| Sepolia Etherscan | [sepolia.etherscan.io](https://sepolia.etherscan.io) |
| MetaMask | [metamask.io](https://metamask.io) |
| ethers.js Docs | [docs.ethers.org](https://docs.ethers.org) |

---

**Your blockchain game is now live! 🚀🎮**

For more help, see:
- `SETUP_GUIDE.md` - Setup details
- `ABI_SETUP.md` - ABI extraction
- `QUICKSTART.md` - Quick reference
