# Gelato Sponsored Transactions Demo

This project demonstrates how to implement gasless transactions using Gelato's Gas Tank and Relay SDK.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Get a Gelato API Key

1. Visit [app.gelato.network](https://app.gelato.network/)
2. Connect your wallet and create an account
3. Create a new API key for sponsored calls
4. Add funds to your Gas Tank (you'll need some ETH on the network you're using)

### 3. Set Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Your Gelato API key from step 2
NEXT_PUBLIC_GELATO_RELAY_API_KEY=your_api_key_here

# Contract address (will be filled after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Optional: Custom RPC URL for Sepolia
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://rpc.sepolia.org
```

### 4. Deploy the Smart Contract

You have two options for deploying the Counter contract:

#### Option A: Using Remix IDE (Recommended for beginners)

1. Copy the contract code from `../contracts/contracts/Counter.sol`
2. Go to [remix.ethereum.org](https://remix.ethereum.org/)
3. Create a new file and paste the contract code
4. Compile the contract (Solidity version 0.8.28)
5. Deploy to Sepolia testnet using MetaMask
6. Copy the deployed contract address to your `.env.local`

#### Option B: Using the existing Hardhat setup (Advanced)

The project already has a Hardhat setup in the `../contracts/` directory:

1. Navigate to the contracts directory:
   ```bash
   cd ../contracts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your private key to `.env`:
   ```bash
   PRIVATE_KEY=your_private_key_here
   ```

4. Deploy to Sepolia:
   ```bash
   npx hardhat ignition deploy ./ignition/modules/Counter.ts --network sepolia
   ```

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## 🔧 How It Works

### Non-ERC2771 Sponsored Calls (Current Implementation)

The current implementation uses simple sponsored calls without ERC2771:

1. **Contract**: A simple counter contract with `inc()` and `incBy(uint)` functions
2. **Frontend**: React components that encode function calls and send them to Gelato
3. **Gelato Relay**: Processes the sponsored transaction and pays for gas

### Key Components

- **`src/lib/gelato.ts`**: Gelato SDK integration and sponsored transaction functions
- **`src/lib/constants.ts`**: Configuration and contract ABI
- **`src/components/sponsored-transaction-demo.tsx`**: Main demo component
- **`../contracts/contracts/Counter.sol`**: Simple counter contract for testing

### Transaction Flow

1. User clicks a button (e.g., "Sponsored +1" or "Sponsored +5")
2. Frontend encodes the function call (`inc()` or `incBy(5)`) using Viem
3. Creates a `SponsoredCallRequest` with the encoded data
4. Sends the request to Gelato via `relay.sponsoredCall()`
5. Gelato executes the transaction and pays for gas
6. Frontend polls for transaction status
7. Counter value updates are reflected in the UI

## 🎯 Testing the Implementation

1. **Connect Wallet**: Click "Connect Wallet" and connect MetaMask to Sepolia
2. **Check Configuration**: Ensure all green checkmarks in the Configuration Status
3. **Test Transactions**: Try the sponsored increment buttons (+1 and custom amount)
4. **Monitor Status**: Watch the transaction status updates in real-time
5. **Verify Results**: See the counters update after successful transactions

## 🔄 Upgrading to ERC2771 (Recommended)

For production applications, consider upgrading to ERC2771 sponsored calls for better security and functionality:

### Benefits of ERC2771
- **Proper msg.sender**: The contract receives the original user's address, not the relayer's
- **Better security**: Prevents relay attacks and ensures proper access control
- **Standard compliance**: Follows the ERC2771 meta-transaction standard

### Implementation Steps

1. **Update Contract**: Inherit from `ERC2771Context` and use `_msgSender()`
2. **Configure Trusted Forwarder**: Set Gelato's trusted forwarder in constructor
3. **Update Frontend**: Use `CallWithERC2771Request` and `sponsoredCallERC2771()`
4. **Initialize GelatoRelay**: Configure with the appropriate trusted forwarder

See the documentation for detailed ERC2771 implementation examples.

## 📚 Resources

- [Gelato Documentation](https://docs.gelato.network/)
- [Gelato Gas Tank](https://docs.gelato.network/developer-services/relay/gas-tank)
- [Supported Networks](https://docs.gelato.network/developer-services/relay/supported-networks)
- [ERC2771 Standard](https://eips.ethereum.org/EIPS/eip-2771)

## 🛠 Troubleshooting

### Common Issues

1. **"Gelato API key not configured"**: Set `NEXT_PUBLIC_GELATO_RELAY_API_KEY`
2. **"Contract address not configured"**: Deploy contract and set `NEXT_PUBLIC_CONTRACT_ADDRESS`
3. **Transaction fails**: Check Gas Tank balance and API key permissions
4. **Wallet connection issues**: Ensure MetaMask is on Sepolia network

### Debug Tips

- Check browser console for detailed error messages
- Verify contract deployment on [Sepolia Etherscan](https://sepolia.etherscan.io/)
- Monitor Gas Tank balance in Gelato dashboard
- Use task ID to track transaction status

## 💡 Next Steps

1. **Add More Functions**: Extend the contract with additional functionality
2. **Implement ERC2771**: Upgrade to meta-transactions for better UX
3. **Add Error Handling**: Implement comprehensive error handling and retries
4. **Multi-chain Support**: Add support for other networks supported by Gelato
5. **Production Deployment**: Deploy to mainnet with proper security considerations