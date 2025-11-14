# Web3 Raffle Platform

A decentralized raffle platform built on Ethereum blockchain with no signup required. Users can participate in raffles using their crypto wallets (MetaMask, Phantom, Trust Wallet, etc.).

## 🔧 Wallet Connection Fixed!

The wallet integration has been improved with:
- ✅ Better error handling and logging
- ✅ Automatic wallet detection
- ✅ Multiple account support
- ✅ Detailed console logs for debugging
- ✅ Test page for troubleshooting ([`test-wallet.html`](test-wallet.html))
- ✅ Comprehensive troubleshooting guide ([`WALLET_TROUBLESHOOTING.md`](WALLET_TROUBLESHOOTING.md))

## Features

- 🎟️ **No Signup Required** - Connect wallet and start participating
- 💰 **Transparent Prize Pools** - All transactions on blockchain
- ⏱️ **Live Countdown Timers** - Real-time raffle status
- 🔐 **Secure Smart Contract** - Auditable and transparent
- 📊 **Participant History** - View all participants and their tickets
- 🎉 **Random Winner Selection** - Fair and verifiable on-chain
- 💳 **Multiple Wallet Support** - MetaMask, Phantom, Trust Wallet, WalletConnect

## Platform Fee

- **10% platform fee** on all prize pools
- Fee recipient: `0x842bab27de95e329eb17733c1f29c082e5dd94c3`
- Remaining 90% goes to the winner

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Blockchain**: Ethereum (Solidity ^0.8.0)
- **Web3 Library**: Ethers.js v5.7.2
- **Wallet Integration**: MetaMask, Trust Wallet, WalletConnect

## Project Structure

```
c-raffel-v2/
├── index.html              # Main HTML file
├── styles.css              # Styling
├── app.js                  # Frontend JavaScript logic
├── contract.js             # Contract ABI and configuration
├── RaffleContract.sol      # Smart contract source code
└── README.md              # This file
```

## Smart Contract Deployment

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (v14 or higher)
2. Install [Hardhat](https://hardhat.org/) or [Remix IDE](https://remix.ethereum.org/)
3. Get testnet ETH from faucets:
   - Sepolia: https://sepoliafaucet.com/
   - Mumbai: https://faucet.polygon.technology/

### Option 1: Deploy with Remix IDE (Easiest)

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `RaffleContract.sol`
3. Copy the contents from `RaffleContract.sol`
4. Compile the contract (Solidity 0.8.0+)
5. Deploy using MetaMask:
   - Select "Injected Provider - MetaMask"
   - Choose network (Sepolia testnet recommended)
   - Click "Deploy"
6. Copy the deployed contract address
7. Update `CONTRACT_ADDRESS` in `contract.js`

### Option 2: Deploy with Hardhat

1. Initialize Hardhat project:
```bash
npm install --save-dev hardhat
npx hardhat init
```

2. Install dependencies:
```bash
npm install --save-dev @nomiclabs/hardhat-ethers ethers
```

3. Copy `RaffleContract.sol` to `contracts/` folder

4. Create deployment script `scripts/deploy.js`:
```javascript
async function main() {
  const RaffleContract = await ethers.getContractFactory("RaffleContract");
  const raffle = await RaffleContract.deploy();
  await raffle.deployed();
  console.log("RaffleContract deployed to:", raffle.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

5. Configure `hardhat.config.js`:
```javascript
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: ["YOUR_PRIVATE_KEY"]
    }
  }
};
```

6. Deploy:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

7. Update `CONTRACT_ADDRESS` in `contract.js` with deployed address

## Configuration

### Update Contract Address

After deploying the smart contract, update the contract address in `contract.js`:

```javascript
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### Network Configuration

The default network is Sepolia testnet. To change networks, update `DEFAULT_NETWORK` in `contract.js`:

```javascript
const DEFAULT_NETWORK = 'sepolia'; // or 'polygon', 'bsc', etc.
```

## Running the Application

### Local Development

1. Open `index.html` in a web browser, or
2. Use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000`

### Production Deployment

Deploy to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop folder
- **GitHub Pages**: Push to gh-pages branch
- **IPFS**: For fully decentralized hosting

## Usage Guide

### For Users

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select your wallet (MetaMask, Trust Wallet, etc.)
   - Approve connection
   - If multiple accounts, select one

2. **Browse Raffles**
   - View active raffles with countdown timers
   - Check prize pools and entry fees
   - See participant history

3. **Buy Tickets**
   - Click "Buy Ticket" on desired raffle
   - Enter number of tickets
   - Approve transaction in wallet
   - Wait for confirmation

4. **Check Results**
   - Winners are automatically selected when countdown ends
   - Winner address is displayed on raffle card
   - Prize is automatically transferred to winner

### For Raffle Creators

To create a raffle, interact with the smart contract directly:

```javascript
// Using ethers.js
const tx = await contract.createRaffle(
  "Raffle Title",
  "https://image-url.com/image.jpg",
  ethers.utils.parseEther("0.1"), // Entry fee
  86400 * 7, // Duration in seconds (7 days)
  { value: ethers.utils.parseEther("1.0") } // Initial prize pool
);
```

Or create an admin panel (future enhancement).

## Smart Contract Functions

### Public Functions

- `createRaffle(title, imageUrl, entryFee, duration)` - Create new raffle
- `buyTicket(raffleId, ticketCount)` - Purchase tickets
- `selectWinner(raffleId)` - Select winner (after end time)
- `getRaffleDetails(raffleId)` - Get raffle information
- `getParticipants(raffleId)` - Get all participants
- `getTicketCount(raffleId, participant)` - Get user's ticket count
- `getActiveRaffles()` - Get all active raffles
- `getAllRaffles()` - Get all raffles

### Events

- `RaffleCreated` - Emitted when raffle is created
- `TicketPurchased` - Emitted when ticket is bought
- `WinnerSelected` - Emitted when winner is chosen
- `PrizePoolUpdated` - Emitted when prize pool changes

## Security Features

- ✅ No external dependencies in smart contract
- ✅ Reentrancy protection
- ✅ Input validation
- ✅ Transparent winner selection
- ✅ Automatic prize distribution
- ✅ Platform fee hardcoded in contract

## Demo Mode

The application includes demo raffles for testing without deploying the contract. To use demo mode, keep the `CONTRACT_ADDRESS` as the placeholder value.

## Supported Networks

- Ethereum Mainnet
- Sepolia Testnet (Recommended for testing)
- Polygon (Matic)
- Mumbai Testnet
- Binance Smart Chain
- BSC Testnet

## Browser Compatibility

- Chrome/Brave (with MetaMask)
- Firefox (with MetaMask)
- Safari (with Trust Wallet)
- Mobile browsers (with Trust Wallet or MetaMask mobile)

## Troubleshooting

### Wallet Connection Issues

If you're having trouble connecting your wallet:

1. **Quick Test:** Open [`test-wallet.html`](test-wallet.html) to diagnose the issue
2. **Detailed Guide:** See [`WALLET_TROUBLESHOOTING.md`](WALLET_TROUBLESHOOTING.md) for comprehensive solutions
3. **Check Console:** Press F12 and look for error messages in the Console tab

**Common Solutions:**
- ✅ Install MetaMask from https://metamask.io/
- ✅ Unlock your wallet
- ✅ Refresh the page (Ctrl+Shift+R)
- ✅ Switch to correct network (Sepolia for testing)
- ✅ Check browser console for detailed logs

### Transaction Failing

- Check if you have enough ETH for gas fees
- Ensure you're on the correct network
- Verify contract address is correct
- Check if raffle is still active
- Get testnet ETH from faucets (see links in deployment guide)

### Contract Not Deployed

- Deploy the smart contract first (see [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md))
- Update `CONTRACT_ADDRESS` in [`contract.js`](contract.js)
- Ensure you're on the correct network
- Verify deployment on block explorer

## Future Enhancements

- [ ] Admin panel for creating raffles
- [ ] Multiple token support (USDC, USDT, etc.)
- [ ] NFT prizes
- [ ] Recurring raffles
- [ ] Social sharing features
- [ ] Email notifications (optional)
- [ ] Mobile app
- [ ] Multi-language support

## License

MIT License - Feel free to use and modify

## Support

For issues or questions:
- Check the troubleshooting section
- Review smart contract on block explorer
- Test on testnet first before mainnet

## Important Notes

⚠️ **Security Reminders:**
- Always test on testnet first
- Never share your private keys
- Verify contract address before transactions
- Start with small amounts for testing

⚠️ **Legal Disclaimer:**
- Check local gambling laws
- This is for educational purposes
- Users are responsible for compliance
- No warranty provided

## Platform Wallet

All platform fees (10%) are sent to:
```
0x842bab27de95e329eb17733c1f29c082e5dd94c3
```

---

Built with ❤️ for the Web3 community