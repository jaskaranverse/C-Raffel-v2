# Quick Start Guide

Get your Web3 Raffle Platform running in 5 minutes!

## 🚀 For Users (Just Want to Use It)

### Step 1: Open the Website
Simply open `index.html` in your browser or visit the hosted version.

### Step 2: Connect Your Wallet
1. Click **"Connect Wallet"** button (top right)
2. Choose your wallet (MetaMask recommended)
3. Approve the connection
4. Done! You're ready to participate

### Step 3: Buy Raffle Tickets
1. Browse available raffles
2. Click **"Buy Ticket"** on any raffle
3. Enter number of tickets
4. Confirm transaction in your wallet
5. Wait for confirmation

### Step 4: Check Results
- Winners are automatically selected when countdown ends
- Check back to see if you won!
- Prize is automatically sent to winner's wallet

---

## 💻 For Developers (Want to Deploy Your Own)

### Prerequisites
- MetaMask wallet installed
- Some testnet ETH (free from faucets)
- Basic understanding of blockchain

### Step 1: Get Testnet ETH
1. Install [MetaMask](https://metamask.io/)
2. Switch to Sepolia Testnet
3. Get free ETH: [Sepolia Faucet](https://sepoliafaucet.com/)

### Step 2: Deploy Smart Contract
1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new file: `RaffleContract.sol`
3. Copy contents from your `RaffleContract.sol`
4. Click "Solidity Compiler" → Compile
5. Click "Deploy & Run" → Select "Injected Provider"
6. Click "Deploy" → Confirm in MetaMask
7. **Copy the contract address!**

### Step 3: Update Configuration
Open `contract.js` and update:
```javascript
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
```

### Step 4: Run Locally
```bash
# Option 1: Simple HTTP server
python -m http.server 8000

# Option 2: Using npm
npm start

# Option 3: Just open index.html in browser
```

### Step 5: Create Your First Raffle
In Remix, use your deployed contract:
```javascript
createRaffle(
  "My First Raffle",                    // title
  "https://via.placeholder.com/500",    // image URL
  "100000000000000000",                 // 0.1 ETH entry fee
  "86400"                               // 1 day duration
)
// Send 1 ETH as initial prize pool
```

---

## 📱 Supported Wallets

### Desktop
- ✅ MetaMask (Recommended)
- ✅ Trust Wallet
- ✅ Coinbase Wallet
- ✅ Any WalletConnect compatible wallet

### Mobile
- ✅ MetaMask Mobile
- ✅ Trust Wallet App
- ✅ Coinbase Wallet App

---

## 🎯 Demo Mode

The app includes demo raffles for testing without deploying:
- Just open `index.html`
- Connect wallet
- Explore the interface
- Note: Transactions won't work in demo mode

---

## 🔧 Common Issues

### "Wallet not detected"
- Install MetaMask extension
- Refresh the page
- Make sure wallet is unlocked

### "Wrong network"
- Switch to Sepolia testnet in MetaMask
- Or deploy to your preferred network

### "Transaction failed"
- Check you have enough ETH for gas
- Ensure raffle is still active
- Try increasing gas limit

---

## 📚 Next Steps

1. **Read Full Documentation**: Check `README.md`
2. **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
3. **Customize**: Edit styles in `styles.css`
4. **Add Features**: Modify `app.js`

---

## 🎨 Customization

### Change Colors
Edit `styles.css`:
```css
:root {
    --primary-color: #6366f1;  /* Change this */
    --secondary-color: #8b5cf6; /* And this */
}
```

### Change Platform Fee
Edit `RaffleContract.sol` before deploying:
```solidity
uint256 public platformFeePercent = 10; // Change to your desired %
```

### Add Your Logo
Replace in `index.html`:
```html
<h1>🎟️ Your Brand Name</h1>
```

---

## 💰 Platform Fees

- **10% fee** on all prize pools
- Sent to: `0x842bab27de95e329eb17733c1f29c082e5dd94c3`
- Remaining 90% goes to winner

---

## 🆘 Need Help?

1. Check `README.md` for detailed info
2. Review `DEPLOYMENT_GUIDE.md` for deployment help
3. Test on Sepolia testnet first
4. Start with small amounts

---

## ⚠️ Important Reminders

- ✅ Always test on testnet first
- ✅ Never share your private keys
- ✅ Verify contract address before transactions
- ✅ Check local gambling laws
- ✅ Start with small amounts

---

## 🎉 You're Ready!

Your Web3 Raffle Platform is ready to use. Start creating raffles and let users participate with their crypto wallets!

**No signup. No email. Just connect and play!**

---

Built with ❤️ for the Web3 community