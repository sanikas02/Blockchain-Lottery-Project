# How to Get the Contract ABI from Remix IDE

## Step-by-Step Guide

### 1. Deploy Contract in Remix

1. Open [https://remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file: `GameRoom.sol`
3. Copy the entire contract code from `contracts/GameRoom.sol`
4. Go to "Solidity Compiler" tab
5. Select compiler version: `0.8.20`
6. Click "Compile GameRoom.sol"
7. Go to "Deploy & Run Transactions" tab
8. Select: "Injected Provider - MetaMask"
9. Ensure MetaMask is on **Sepolia testnet**
10. Click "Deploy"
11. Confirm transaction in MetaMask

### 2. Copy the ABI

After successful deployment:

**Method 1: From Remix Interface (Easiest)**
1. Go back to "Solidity Compiler" tab
2. Under your contract name, you'll see the compiled contract
3. Look for buttons on the right side
4. Click the **"Copy ABI"** button (looks like two overlapping squares)
5. The ABI will be copied to your clipboard

**Method 2: Manual Copy**
1. In "Solidity Compiler" tab
2. Expand the contract details
3. Copy the JSON array that appears in the "ABI" section

### 3. Update .env.local

1. Open `.env.local` in your project
2. Find this line:
```
NEXT_PUBLIC_CONTRACT_ABI='[...]'
```

3. Replace `[...]` with the copied ABI, so it looks like:
```
NEXT_PUBLIC_CONTRACT_ABI='[{"inputs":[{"internalType":"string","name":"_roomId","type":"string"},...],"name":"createRoom",...}]'
```

4. Also update:
```
NEXT_PUBLIC_CONTRACT_ADDRESS='0x...'  # Copy from Remix deployment result
```

### 4. Restart Dev Server

```bash
npm run dev
```

## ABI Structure

The ABI is a JSON array containing function and event definitions:

```json
[
  {
    "inputs": [...],
    "name": "createRoom",
    "outputs": [],
    "type": "function",
    "stateMutability": "payable"
  },
  {
    "inputs": [...],
    "name": "joinRoom", 
    "outputs": [],
    "type": "function",
    "stateMutability": "payable"
  },
  // ... more functions and events
]
```

## Troubleshooting

### ABI Copy Button Not Showing?
- Make sure contract is compiled successfully (green checkmark)
- Try refreshing the Remix page
- Clear browser cache

### "Invalid ABI" Error
- Verify the entire JSON array is copied (should start with `[` and end with `]`)
- Remove any extra whitespace or line breaks at the beginning/end
- Make sure it's properly formatted JSON

### Contract Address Not Displaying?
- Check Remix's deployment confirmations
- Look in MetaMask "Activity" tab to confirm transaction
- Wait for transaction to be mined

## Saving the ABI

You may want to save the ABI in a file for backup:

Create `lib/contractABI.json`:
```json
[
  // Paste your full ABI here
]
```

Then import in your code:
```typescript
import contractABI from '@/lib/contractABI.json';
```

## Quick Reference

| Item | Where to Find |
|------|---|
| Contract Address | Remix deployment result or MetaMask transaction |
| ABI | Remix "Solidity Compiler" tab → Copy ABI button |
| Network | Sepolia (Chain ID: 11155111) |
| RPC URL | https://sepolia.infura.io/v3/YOUR_KEY |

---

If you encounter any issues, refer to the main [SETUP_GUIDE.md](SETUP_GUIDE.md)
