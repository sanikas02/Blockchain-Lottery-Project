# System Architecture & Game Flow

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Player Browser                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Next.js Frontend (React + TypeScript)          │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  - Create/Join Room UI                          │  │ │
│  │  │  - Player List Display                          │  │ │
│  │  │  - Winner Announcement                          │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│          ↓                                          ↓       │
│  ┌──────────────────────┐              ┌──────────────────┐ │
│  │   MetaMask Wallet    │              │   WebSocket      │ │
│  │  (User Account &     │              │   Connection     │ │
│  │   ETH Management)    │              │  (Real-time UI)  │ │
│  └──────────────────────┘              └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
          ↓                                          ↓
    ┌──────────────────────────────┐      ┌────────────────┐
    │  Sepolia Blockchain          │      │  WebSocket     │
    │  ┌────────────────────────┐  │      │  Server        │
    │  │ Smart Contract         │  │      │  ┌──────────┐  │
    │  │ (GameRoom.sol)         │  │      │  │ Room Mgmt│  │
    │  │                        │  │      │  │ Logic    │  │
    │  │ - createRoom()         │  │      │  └──────────┘  │
    │  │ - joinRoom()           │  │      └────────────────┘
    │  │ - finalizeGame()       │  │
    │  │ - getRoomDetails()     │  │
    │  │                        │  │
    │  │ Events:                │  │
    │  │ - RoomCreated          │  │
    │  │ - PlayerJoined         │  │
    │  │ - GameFinalized        │  │
    │  │ - WinnerSelected       │  │
    │  └────────────────────────┘  │
    └──────────────────────────────┘
```

---

## 🎮 Game Flow Sequence

### Phase 1: Room Creation

```
User A
│
├─ Clicks "Create Room"
│  
├─ Enters 4-digit ID (e.g., "1234")
│  
├─ Confirms MetaMask transaction
│  └─ Transaction: createRoom("1234", {value: 0.01 ETH})
│     
├─ Smart Contract:
│  ├─ Validates room doesn't exist
│  ├─ Stores room data
│  ├─ Adds User A as first player
│  ├─ Receives 0.01 ETH stake
│  └─ Emits RoomCreated event
│     
├─ Frontend Updates:
│  ├─ Displays room with 1/4 players
│  ├─ Shows User A's wallet address
│  ├─ Displays room ID "1234"
│  │
│  └─ WebSocket broadcasts to all clients:
│     └─ "Room 1234 created! Join now!"
│
└─ User A waits for other players
```

### Phase 2: Players Joining

```
User B
│
├─ Clicks "Join Room"
│  
├─ Enters room ID "1234"
│  
├─ Confirms MetaMask transaction
│  └─ Transaction: joinRoom("1234", {value: 0.01 ETH})
│     
├─ Smart Contract:
│  ├─ Validates room exists
│  ├─ Validates user not already in room
│  ├─ Validates room not full (< 4)
│  ├─ Adds User B as player
│  ├─ Receives 0.01 ETH stake
│  │
│  ├─ Emits PlayerJoined event
│  │
│  └─ If players < 4:
│     └─ Game continues
│        (Same for Users C & D)
│
└─ Frontend: Shows 2/4 Players
```

### Phase 3: Game Finalization (4th Player Joins)

```
User D joins as 4th player

Smart Contract (joinRoom):
│
├─ Validates and adds User D
│
├─ Detects: players.length == 4
│
├─ Auto-triggers finalizeGame():
│  ├─ Generates random number:
│  │  └─ keccak256(timestamp + prevrandao + roomId) % 4
│  │
│  ├─ Selects winner index (0-3)
│  │  └─ Picks one of the 4 players
│  │
│  ├─ Transfers 0.04 ETH to winner:
│  │  └─ (bool success, ) = payable(winner).call{value: 0.04}("")
│  │
│  ├─ Sets roomFinalized = true
│  │
│  └─ Emits GameFinalized event
│
└─ Frontend:
   ├─ Displays trophy emoji 🏆
   ├─ Shows winner address
   ├─ Shows prize: 0.04 Sepolia ETH
   └─ WebSocket updates all clients
```

---

## 💫 Real-time Updates (WebSocket)

```
Timeline:

00:00 - User A creates room "1234"
        └─ WS: RoomCreated event
           All clients notified: "Room 1234 created"

00:05 - User B joins room "1234"
        └─ WS: PlayerJoined (2/4)
           All clients updated live

00:10 - User C joins room "1234"
        └─ WS: PlayerJoined (3/4)
           All clients updated live

00:15 - User D joins room "1234"
        └─ WS: PlayerJoined (4/4)
        └─ Smart contract auto-finalizes
        └─ WS: GameFinalized
           Winner announced to all clients
           Refresh shows completed game
```

---

## 📊 State Management

### Frontend State

```typescript
// Main page state
currentRoomId: string | null
showCreateModal: boolean
showJoinModal: boolean
username: string

// Web3 state (from useWeb3 hook)
account: string
isConnected: boolean
loading: boolean
error: string

// Room state (from useWebSocket hook)
roomData: {
  roomId: string
  playerCount: number
  finalized: boolean
}
players: Player[]
gameFinalized: boolean
winner: string | null
```

### Smart Contract State

```solidity
// Mapping: roomId -> Room data
mapping(string => Room) public rooms

// Room structure
struct Room {
  string roomId
  address[] players        // Max 4
  uint256[] stakes         // 0.01 ETH each
  bool roomFinalized       // Game completed?
  address winner           // 0x00... if not finalized
  uint256 createdAt        // Timestamp
}

// Tracking: Is address in room?
mapping(string => mapping(address => bool)) playerInRoom
```

---

## 🔄 Data Flow

### Creating Room

```
User Input
  │
  ├─ Validate input (4 digits)
  │
  ├─ Call: web3.createRoom(roomId)
  │  └─ ethers.js → MetaMask → Blockchain
  │
  ├─ Smart Contract processes
  │  ├─ Checks: room doesn't exist
  │  ├─ Stores: room data + players
  │  ├─ Receives: 0.01 ETH stake
  │  └─ Emits: RoomCreated event
  │
  ├─ Transaction confirmed (1-2 min)
  │
  ├─ Frontend updates
  │  └─ setCurrentRoomId(roomId)
  │  └─ Fetch room details from contract
  │
  └─ WebSocket notifies
     └─ All connected clients see update
```

### Joining Room

```
User Input
  │
  ├─ Validate input (room exists?)
  │
  ├─ Call: web3.joinRoom(roomId)
  │  └─ ethers.js → MetaMask → Blockchain
  │
  ├─ Smart Contract processes
  │  ├─ Checks: room exists + not full
  │  ├─ Checks: user not already joined
  │  ├─ Adds: user to players array
  │  ├─ Receives: 0.01 ETH stake
  │  ├─ Emits: PlayerJoined event
  │  │
  │  └─ If players == 4:
  │     ├─ Selects random winner
  │     ├─ Transfers 0.04 ETH to winner
  │     └─ Emits: GameFinalized event
  │
  ├─ Transaction confirmed
  │
  ├─ Frontend updates
  │  └─ Get updated room details
  │  └─ Set winner if finalized
  │
  └─ WebSocket broadcasts
     └─ All clients see new player
     └─ All clients see winner (if full)
```

---

## 💳 Fund Flow

### Per Game (4 Players)

```
Initial State:
  Pool: 0 ETH
  Smart Contract: 0 ETH

Player 1 stakes 0.01 ETH:
  Pool: 0.01 ETH
  Smart Contract: 0.01 ETH (locked)

Player 2 stakes 0.01 ETH:
  Pool: 0.02 ETH
  Smart Contract: 0.02 ETH

Player 3 stakes 0.01 ETH:
  Pool: 0.03 ETH
  Smart Contract: 0.03 ETH

Player 4 stakes 0.01 ETH:
  Pool: 0.04 ETH
  Smart Contract: 0.04 ETH

Game Finalizes → Winner selected (Random):
  │
  ├─ Player 1 loses:  -0.01 ETH (stake transferred to contract)
  ├─ Player 2 loses:  -0.01 ETH
  ├─ Player 3 loses:  -0.01 ETH
  │
  └─ Player 4 WINS:   +0.03 ETH (0.04 prize - 0.01 stake)
     └─ Net: Started with 0.01 ETH stake
        Ends with 0.04 ETH received
        Profit: +0.03 ETH (3x return)
```

---

## 🔐 Security Checks

### Smart Contract Validation

```
createRoom(roomId, value)
  ├─ Requires: value == 0.01 ETH
  ├─ Requires: roomId length == 4
  ├─ Requires: room doesn't exist
  └─ Ensures: msg.sender is added as player

joinRoom(roomId, value)
  ├─ Requires: value == 0.01 ETH
  ├─ Requires: room exists
  ├─ Requires: room not finalized
  ├─ Requires: room not full (< 4 players)
  ├─ Requires: msg.sender not already in room
  └─ Ensures: msg.sender is added as player

finalizeGame(roomId)
  ├─ Requires: room exists
  ├─ Requires: room not already finalized
  ├─ Requires: exactly 4 players
  ├─ Selects: random winner
  ├─ Transfers: 0.04 ETH to winner
  └─ Protection: Reentrancy via checks-effects-interactions
```

### Frontend Validation

```
Create Room:
  ├─ Check: connected to wallet
  ├─ Check: room ID is 4 digits
  ├─ Check: only numbers in ID
  └─ Show: error messages

Join Room:
  ├─ Check: connected to wallet
  ├─ Check: room ID is 4 digits
  ├─ Check: only numbers in ID
  └─ Show: error messages
```

---

## 📈 Scalability

### Current Design
- **Per Room**: 4 players max
- **Concurrent Rooms**: Unlimited
- **Storage**: O(n) where n = total players across all rooms

### Optimization Ideas
- Use pools instead of individual rooms
- Implement batching for lower gas
- Use off-chain computation + Chainlink VRF
- Add tournament mode
- Implement leaderboards

---

## 🌐 Network Communication

### WebSocket Messages

```javascript
// Room Updates
{
  type: 'ROOM_UPDATE',
  roomId: '1234',
  players: [...],
  playerCount: 2,
  finalized: false,
  winner: null
}

// Game Finalized
{
  type: 'GAME_FINALIZED',
  roomId: '1234',
  winner: '0x123...',
  players: [...]
}

// Ready to Finalize
{
  type: 'READY_TO_FINALIZE',
  roomId: '1234',
  players: [...]
}

// Error
{
  type: 'ERROR',
  message: 'Room is full'
}
```

---

## 🔄 Component Lifecycle

```
Page Loads
  │
  ├─ useWeb3() hooks initializes
  │  └─ Checks if MetaMask available
  │  └─ Checks if already connected
  │
  ├─ User clicks "Connect Wallet"
  │  ├─ Requests account access
  │  ├─ Gets signer
  │  ├─ Creates contract instance
  │  └─ state.isConnected = true
  │
  ├─ User creates/joins room
  │  ├─ Calls contract method
  │  ├─ setCurrentRoomId(roomId)
  │  ├─ useWebSocket creates connection
  │  └─ RoomComponent mounts
  │
  ├─ RoomComponent
  │  ├─ Fetches room details from contract
  │  ├─ Listens to WebSocket updates
  │  ├─ Re-renders on state changes
  │  └─ Displays player list
  │
  └─ Game finalizes
     ├─ Shows winner
     ├─ Displays prize
     └─ "Back to Home" button
```

---

## 🎯 Key Decision Points

### Why 4 Players?
- Small pool → Fast games (minutes)
- 25% win rate → Fair odds
- 4x return → Attractive incentive
- Low gas cost per participant

### Why WebSocket?
- Real-time updates
- Don't need to poll blockchain
- Better UX (instant feedback)
- Scales better than constant calls

### Why Random Selection?
- Fair for all players
- Can't predict winner
- Built with secure entropy (block.prevrandao)

### Why Sepolia Testnet?
- Free ETH from faucets
- Safe for testing
- No real money risk
- Can redeploy contract easily

---

This architecture ensures:
- ✅ Real-time gameplay experience
- ✅ Secure fund management
- ✅ Transparent winner selection
- ✅ Scalable room system
- ✅ Fair game mechanics
