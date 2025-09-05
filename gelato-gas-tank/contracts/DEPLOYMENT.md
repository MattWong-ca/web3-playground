# Counter Contract Deployment Guide

This guide explains how to deploy the Counter contract using the provided deployment scripts.

## Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the contracts directory with:
   ```
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   SEPOLIA_PRIVATE_KEY=your_private_key_here
   ```

## Deployment Options

### Option 1: Using Hardhat Ignition (Recommended)

Deploy using the Ignition module which includes initialization:

```bash
# Deploy to local hardhat network
npx hardhat run scripts/deploy.ts

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.ts --network sepolia
```

This method uses the existing Ignition module that:
- Deploys the Counter contract
- Calls `incBy(5)` to set initial value to 5

### Option 2: Direct Deployment

Deploy using direct contract deployment:

```bash
# Deploy to local hardhat network
npx hardhat run scripts/deploy-direct.ts

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy-direct.ts --network sepolia
```

This method:
- Deploys the contract with initial value 0
- Shows deployer address and balance
- Tests contract functionality (on non-mainnet networks)
- Provides gas usage information

### Option 3: Using Hardhat Ignition CLI

```bash
# Deploy to local network
npx hardhat ignition deploy ignition/modules/Counter.ts

# Deploy to Sepolia
npx hardhat ignition deploy ignition/modules/Counter.ts --network sepolia
```

## Network Configuration

The project is configured with the following networks:

- `hardhat` - Local development network
- `hardhatMainnet` - Simulated mainnet
- `hardhatOp` - Simulated Optimism
- `sepolia` - Sepolia testnet

## Environment Variables

Required environment variables:

- `SEPOLIA_RPC_URL` - RPC endpoint for Sepolia testnet
- `SEPOLIA_PRIVATE_KEY` - Private key for deployment account

## Contract Information

- **Contract Name**: Counter
- **Solidity Version**: 0.8.28
- **Initial State**: `x = 0` (unless using Ignition module)
- **Functions**:
  - `inc()` - Increments counter by 1
  - `incBy(uint by)` - Increments counter by specified amount
  - `x` - Public variable to read current counter value

## Example Output

```
Deploying Counter contract to network: sepolia
🔑 Deploying from account: 0x1234...5678
💰 Account balance: 1000000000000000000 wei
🚀 Deploying Counter contract...
✅ Counter contract deployed successfully!
📍 Contract address: 0xabcd...ef01
🔗 Network: sepolia
⛽ Gas used: 123456
📊 Initial counter value: 0
🧪 Testing contract functionality...
📊 Counter value after incBy(5): 5
```

## Verification

After deployment, you can verify the contract on Etherscan:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Troubleshooting

1. **Insufficient funds**: Ensure your deployment account has enough ETH for gas fees
2. **RPC errors**: Check your RPC URL and network connectivity
3. **Private key issues**: Ensure your private key is correctly formatted (without 0x prefix)
4. **Network issues**: Verify the network name matches your Hardhat configuration
