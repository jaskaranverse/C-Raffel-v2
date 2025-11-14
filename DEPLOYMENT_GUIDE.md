# Smart Contract Deployment Guide

This guide will walk you through deploying the RaffleContract to the blockchain.

## Quick Start (Remix IDE - Recommended for Beginners)

### Step 1: Prepare Your Wallet

1. Install [MetaMask](https://metamask.io/) browser extension
2. Create or import a wallet
3. Switch to **Sepolia Testnet**:
   - Click MetaMask extension
   - Click network dropdown (top)
   - Enable "Show test networks" in settings
   - Select "Sepolia"
4. Get free testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

### Step 2: Open Remix IDE

1. Go to [https://remix.ethereum.org/](https://remix.ethereum.org/)
2. Create a new file: `RaffleContract.sol`
3. Copy the entire contents from your local `RaffleContract.sol` file
4. Paste into Remix

### Step 3: Compile the Contract

1. Click on "Solidity Compiler" icon (left sidebar)
2. Select compiler version: `0.8.0` or higher
3. Click "Compile RaffleContract.sol"
4. Wait for green checkmark

### Step 4: Deploy the Contract

1. Click on "Deploy & Run Transactions" icon (left sidebar)
2. In "ENVIRONMENT" dropdown, select **"Injected Provider - MetaMask"**
3. MetaMask will popup - click "Connect"
4. Confirm you're on Sepolia network
5. Click **"Deploy"** button (orange)
6. MetaMask will popup for transaction confirmation
7. Review gas fees and click "Confirm"
8. Wait for deployment (10-30 seconds)

### Step 5: Copy Contract Address

1. After deployment, look in "Deployed Contracts" section
2. You'll see your contract with an address like: `0x1234...5678`
3. Click the copy icon next to the address
4. **Save this address!**

### Step 6: Update Your Website

1. Open `contract.js` in your project
2. Find this line:
```javascript
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
```
3. Replace with your deployed address:
```javascript
const CONTRACT_ADDRESS = "0xYourActualContractAddress";
```
4. Save the file

### Step 7: Verify on Block Explorer

1. Go to [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Paste your contract address in search
3. You should see your contract!

## Advanced Deployment (Hardhat)

### Prerequisites

```bash
node --version  # Should be v14+
npm --version
```

### Step 1: Setup Project

```bash
# Create new directory
mkdir raffle-deployment
cd raffle-deployment

# Initialize npm
npm init -y

# Install Hardhat
npm install --save-dev hardhat

# Initialize Hardhat
npx hardhat init
# Select: "Create a JavaScript project"
```

### Step 2: Install Dependencies

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install --save-dev @nomiclabs/hardhat-ethers ethers
npm install dotenv
```

### Step 3: Configure Hardhat

Create `.env` file:
```env
PRIVATE_KEY=your_wallet_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
```

⚠️ **NEVER commit `.env` to git!**

Update `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

### Step 4: Add Contract

Copy `RaffleContract.sol` to `contracts/` folder

### Step 5: Create Deployment Script

Create `scripts/deploy.js`:
```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying RaffleContract...");

  const RaffleContract = await hre.ethers.getContractFactory("RaffleContract");
  const raffle = await RaffleContract.deploy();

  await raffle.deployed();

  console.log("✅ RaffleContract deployed to:", raffle.address);
  console.log("Platform wallet:", await raffle.platformWallet());
  console.log("Platform fee:", await raffle.platformFeePercent(), "%");
  
  console.log("\n📋 Update contract.js with this address:");
  console.log(`const CONTRACT_ADDRESS = "${raffle.address}";`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Step 6: Deploy

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Step 7: Verify Contract (Optional but Recommended)

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

## Network Options

### Testnets (Free - Recommended for Testing)

#### Sepolia (Ethereum Testnet)
- Faucet: https://sepoliafaucet.com/
- Explorer: https://sepolia.etherscan.io/
- RPC: https://sepolia.infura.io/v3/

#### Mumbai (Polygon Testnet)
- Faucet: https://faucet.polygon.technology/
- Explorer: https://mumbai.polygonscan.com/
- RPC: https://rpc-mumbai.maticvigil.com/

#### BSC Testnet
- Faucet: https://testnet.binance.org/faucet-smart
- Explorer: https://testnet.bscscan.com/
- RPC: https://data-seed-prebsc-1-s1.binance.org:8545/

### Mainnets (Real Money - Use with Caution)

#### Ethereum Mainnet
- High gas fees ($50-$200 per deployment)
- Most secure and decentralized
- Use for production only

#### Polygon (Matic)
- Low gas fees ($0.01-$1)
- Fast transactions
- Good for production

#### Binance Smart Chain
- Low gas fees ($0.10-$5)
- Fast transactions
- Centralized but popular

## Creating Test Raffles

After deployment, you can create test raffles using Remix:

1. In Remix, find your deployed contract
2. Expand the contract functions
3. Find `createRaffle` function
4. Fill in parameters:
   - `_title`: "Test Raffle"
   - `_imageUrl`: "https://via.placeholder.com/500"
   - `_entryFee`: 100000000000000000 (0.1 ETH in wei)
   - `_duration`: 86400 (1 day in seconds)
5. Set VALUE: 1000000000000000000 (1 ETH initial prize)
6. Click "transact"
7. Confirm in MetaMask

## Troubleshooting

### "Insufficient funds for gas"
- Get more testnet ETH from faucet
- Wait a few minutes and try again

### "Nonce too high"
- Reset MetaMask account:
  - Settings → Advanced → Reset Account

### "Contract deployment failed"
- Check compiler version matches (0.8.0+)
- Ensure you have enough gas
- Try increasing gas limit

### "Cannot read properties of undefined"
- Ensure MetaMask is connected
- Check you're on correct network
- Refresh Remix page

## Gas Optimization Tips

1. **Deploy on L2 networks** (Polygon, Arbitrum) for lower fees
2. **Use testnets first** to ensure everything works
3. **Deploy during low traffic** (weekends, late night UTC)
4. **Set reasonable gas limits** (don't overpay)

## Security Checklist

Before deploying to mainnet:

- [ ] Test thoroughly on testnet
- [ ] Verify platform wallet address is correct
- [ ] Check platform fee percentage
- [ ] Test all functions (create, buy, select winner)
- [ ] Verify contract on block explorer
- [ ] Consider professional audit for large amounts
- [ ] Have emergency pause mechanism (future enhancement)

## Post-Deployment

1. **Update website** with contract address
2. **Test on website** with small amounts
3. **Create initial raffles** to attract users
4. **Monitor transactions** on block explorer
5. **Keep private keys secure**

## Getting Help

- Remix Documentation: https://remix-ide.readthedocs.io/
- Hardhat Documentation: https://hardhat.org/docs
- Ethers.js Documentation: https://docs.ethers.io/
- Ethereum Stack Exchange: https://ethereum.stackexchange.com/

## Important Reminders

⚠️ **NEVER share your private key**
⚠️ **Test on testnet first**
⚠️ **Start with small amounts**
⚠️ **Verify contract address before use**
⚠️ **Keep backup of contract address**

---

Good luck with your deployment! 🚀