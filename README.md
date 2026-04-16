# ⛓️ Blockchain Game Room

A decentralized, multiplayer gaming platform built on Ethereum (Sepolia testnet) using Next.js, Solidity, and WebSocket for real-time updates.

## 🎮 Features

✅ **Create & Join Rooms**: 4-digit room IDs  
✅ **Multiple Players**: Up to 4 players per room  
✅ **Staking System**: 0.01 Sepolia ETH per player  
✅ **Random Winner**: Fair, on-chain winner selection  
✅ **Prize Pool**: Winner gets 0.04 Sepolia ETH  
✅ **Real-time Updates**: WebSocket for live room status  
✅ **Modern UI**: Gradient design with Tailwind CSS  
✅ **Mobile Responsive**: Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask or Web3 wallet
- Sepolia testnet ETH (free from faucet)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Deploy contract (see DEPLOYMENT_GUIDE.md)
# 3. Configure environment (see QUICKSTART.md)

# 4. Start development server
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Setup Steps

### 1️⃣ Deploy Smart Contract

**Via Remix IDE**:
1. Open [remix.ethereum.org](https://remix.ethereum.org)
2. Create `GameRoom.sol` and paste code from `contracts/GameRoom.sol`
3. Compile with Solidity 0.8.20
4. Deploy to Sepolia testnet via MetaMask
5. Copy contract address & ABI

See: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### 2️⃣ Configure Environment

**Update `.env.local`**:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CONTRACT_ABI=[...]
```

See: [ABI_SETUP.md](ABI_SETUP.md)

### 3️⃣ Run Project

```bash
npm run dev
```

### 4️⃣ Test Game

1. Connect wallet
2. Create room (4-digit ID)
3. Join with different accounts
4. After 4 players, draw winner

## 📁 Project Structure

```
├── contracts/
│   └── GameRoom.sol              # Smart contract
├── app/
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Layout
│   ├── api/websocket/route.ts   # WebSocket endpoint
│   └── globals.css               # Styles
├── components/
│   ├── RoomComponent.tsx         # Room display
│   ├── CreateRoomModal.tsx       # Create form
│   └── JoinRoomModal.tsx         # Join form
├── lib/
│   ├── config.ts                 # Config
│   ├── useWeb3.ts                # Web3 hook
│   ├── useWebSocket.ts           # WebSocket hook
│   └── websocket.ts              # WS server
├── .env.local                    # Environment vars
├── QUICKSTART.md                 # Quick start
├── SETUP_GUIDE.md                # Full setup
├── DEPLOYMENT_GUIDE.md           # Deployment
└── ABI_SETUP.md                  # ABI extraction
```

## 💰 Game Economics

| Item | Value |
|------|-------|
| **Stake per player** | 0.01 Sepolia ETH |
| **Total pool** | 0.04 Sepolia ETH |
| **Winner prize** | 0.04 Sepolia ETH |
| **Win probability** | 25% (1 in 4) |
| **ROI** | 4x bet |

## 🎯 How to Play

1. **Connect Wallet**
   - Click "Connect Wallet" 
   - Approve MetaMask

2. **Create or Join Room**
   - **Create**: Enter 4-digit ID, stake 0.01 ETH
   - **Join**: Enter room ID, stake 0.01 ETH

3. **Wait for Players**
   - Room needs 4 players
   - Share room ID with others

4. **Draw Winner**
   - Click "🎲 Draw Winner" when full
   - Winner selected randomly
   - Prize transferred on-chain

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run lint         # Run ESLint

# Production
npm run build        # Build for production
npm start            # Start production server
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](QUICKSTART.md) | Quick reference & overview |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Complete setup guide |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Step-by-step deployment |
| [ABI_SETUP.md](ABI_SETUP.md) | Extract ABI from Remix |

## 🔐 Security

- ✓ Reentrancy protection (checks-effects-interactions)
- ✓ Proper error handling
- ✓ Event logging for transparency
- ✓ Safe arithmetic (Solidity 0.8.20+)

⚠️ **This is for testnet/education**. For production:
- Add comprehensive audits
- Use Chainlink VRF for randomness
- Implement access controls
- Add rate limiting

## 🧪 Testing

### Test Players
1. Create 4 MetaMask test accounts
2. Get Sepolia ETH from [faucet](https://sepoliafaucet.com)
3. Create room with Account 1
4. Join with Accounts 2, 3, 4
5. Draw winner
6. Verify transaction on [Etherscan Sepolia](https://sepolia.etherscan.io)

### Monitor Transactions
- Search contract address on Sepolia Etherscan
- View all function calls
- Check gas usage and fees

## 🌐 Networks

**Sepolia Testnet**
- Chain ID: 11155111
- Block Explorer: https://sepolia.etherscan.io
- Get ETH: https://sepoliafaucet.com

## 🐛 Troubleshooting

**Problem**: "Contract not initialized"
- Check `.env.local` has correct contract address & ABI
- Restart dev server with `npm run dev`

**Problem**: "Network mismatch"
- Switch MetaMask to Sepolia testnet
- Ensure wallet is connected

**Problem**: "No balance"
- Get free Sepolia ETH from [faucet](https://sepoliafaucet.com)
- Wait 5-10 minutes for ETH to arrive

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for more troubleshooting.

## 📱 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Blockchain**: Solidity 0.8.20, ethers.js 6
- **Real-time**: WebSocket (ws library)
- **Wallet**: MetaMask / EIP-6963

## 🚢 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

Or deploy to Vercel:
```bash
npm i -g vercel
vercel
```

## ✅ Checklist

- [ ] Deploy contract on Remix
- [ ] Get contract address & ABI
- [ ] Update `.env.local`
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Connect MetaMask to Sepolia
- [ ] Create room
- [ ] Join with multiple accounts
- [ ] Draw winner
- [ ] Verify on Etherscan

## 📞 Support

For detailed guides, see:
- **New?** Start with [QUICKSTART.md](QUICKSTART.md)
- **Deploying?** Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Need ABI?** Check [ABI_SETUP.md](ABI_SETUP.md)
- **Full setup?** Read [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 📄 License

MIT - Educational use

---

**Built with ❤️ for blockchain gaming**

Ready to play? Start with [QUICKSTART.md](QUICKSTART.md)! 🚀

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
