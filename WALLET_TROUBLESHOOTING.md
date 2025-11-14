# Wallet Connection Troubleshooting Guide

This guide will help you diagnose and fix wallet connection issues.

## Quick Test

1. Open [`test-wallet.html`](test-wallet.html) in your browser
2. Click "Check Environment" - should show ✅ for all checks
3. Click "Connect MetaMask" - should connect successfully
4. Open browser console (F12) to see detailed logs

## Common Issues & Solutions

### Issue 1: "MetaMask is not installed"

**Symptoms:**
- Error message: "MetaMask is not installed"
- Connect button does nothing

**Solutions:**
1. Install MetaMask extension:
   - Chrome/Brave: https://metamask.io/download/
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/
   - Edge: https://microsoftedge.microsoft.com/addons/detail/metamask/

2. After installation:
   - Refresh the page
   - Click the MetaMask extension icon
   - Create or import a wallet
   - Try connecting again

### Issue 2: "No Ethereum provider detected"

**Symptoms:**
- Console shows: "No Ethereum provider detected"
- Wallet modal doesn't work

**Solutions:**
1. **Check if MetaMask is enabled:**
   - Click MetaMask extension icon
   - Make sure it's unlocked
   - Refresh the page

2. **Check browser compatibility:**
   - Use Chrome, Firefox, Brave, or Edge
   - Safari requires Trust Wallet app

3. **Disable conflicting extensions:**
   - Disable other wallet extensions temporarily
   - Only keep MetaMask enabled

### Issue 3: Connection request rejected

**Symptoms:**
- Error: "User rejected the connection request"
- MetaMask popup closed without approval

**Solutions:**
1. Click "Connect Wallet" again
2. When MetaMask popup appears, click "Connect"
3. Don't close the popup without clicking "Connect"

### Issue 4: Wallet connects but shows wrong network

**Symptoms:**
- Wallet connects successfully
- But transactions fail
- Wrong network displayed

**Solutions:**
1. **Switch to correct network in MetaMask:**
   - Click MetaMask extension
   - Click network dropdown (top)
   - Select "Sepolia Test Network" (for testing)
   - Or select your desired network

2. **Add custom network if needed:**
   ```
   Network Name: Sepolia
   RPC URL: https://sepolia.infura.io/v3/
   Chain ID: 11155111
   Currency Symbol: ETH
   Block Explorer: https://sepolia.etherscan.io
   ```

### Issue 5: "Ethers.js not loaded"

**Symptoms:**
- Console error: "ethers is not defined"
- Page loads but wallet won't connect

**Solutions:**
1. **Check internet connection:**
   - Ethers.js loads from CDN
   - Requires internet connection

2. **Check if CDN is blocked:**
   - Open browser console (F12)
   - Look for network errors
   - Try disabling ad blockers

3. **Verify script tag in HTML:**
   ```html
   <script src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js"></script>
   ```

### Issue 6: Multiple accounts not showing

**Symptoms:**
- Have multiple MetaMask accounts
- Only one account shown

**Solutions:**
1. This is normal - app auto-selects first account
2. To switch accounts:
   - Open MetaMask
   - Click account icon (top right)
   - Select different account
   - Page will auto-refresh

### Issue 7: Wallet disconnects randomly

**Symptoms:**
- Wallet connects successfully
- Then disconnects after a while

**Solutions:**
1. **Check MetaMask lock settings:**
   - MetaMask → Settings → Advanced
   - Adjust "Auto-Lock Timer"

2. **Keep MetaMask unlocked:**
   - Don't lock MetaMask manually
   - Keep browser tab active

### Issue 8: "Insufficient funds for gas"

**Symptoms:**
- Wallet connects fine
- But can't buy tickets
- Transaction fails

**Solutions:**
1. **Get testnet ETH (for testing):**
   - Sepolia: https://sepoliafaucet.com/
   - Mumbai: https://faucet.polygon.technology/
   - BSC Testnet: https://testnet.binance.org/faucet-smart

2. **Check balance:**
   - Open MetaMask
   - Make sure you have ETH for gas fees
   - Need at least 0.01 ETH for transactions

## Debugging Steps

### Step 1: Open Browser Console
1. Press F12 (or Cmd+Option+I on Mac)
2. Click "Console" tab
3. Look for error messages in red

### Step 2: Check Console Logs
Look for these messages:
```
✅ Good signs:
- "Initializing app..."
- "MetaMask detected"
- "Accounts received: [...]"
- "Wallet connected successfully!"

❌ Bad signs:
- "MetaMask not found"
- "No Ethereum provider detected"
- "Error connecting wallet"
```

### Step 3: Test with test-wallet.html
1. Open `test-wallet.html`
2. Click "Check Environment"
3. All checks should show ✅
4. If any show ❌, follow the specific solution

### Step 4: Verify MetaMask Installation
1. Look for MetaMask fox icon in browser toolbar
2. Click it - should open MetaMask popup
3. If not visible:
   - Click puzzle icon in toolbar
   - Pin MetaMask extension

## Network-Specific Issues

### Ethereum Mainnet
- High gas fees ($50-$200)
- Use testnet for testing first
- Make sure you have enough ETH

### Sepolia Testnet (Recommended)
- Free testnet ETH from faucet
- Perfect for testing
- No real money involved

### Polygon/Matic
- Low gas fees
- Fast transactions
- Need MATIC for gas

### BSC (Binance Smart Chain)
- Low gas fees
- Need BNB for gas
- Popular alternative

## Browser-Specific Issues

### Chrome/Brave
- ✅ Best compatibility
- MetaMask works perfectly
- No known issues

### Firefox
- ✅ Good compatibility
- Install MetaMask from Firefox Add-ons
- May need to refresh after install

### Safari
- ⚠️ Limited support
- Use Trust Wallet app instead
- Or use Chrome/Firefox

### Mobile Browsers
- Use MetaMask Mobile app
- Or Trust Wallet app
- Open website in app's browser

## Still Having Issues?

### Check These:
1. ✅ MetaMask is installed and unlocked
2. ✅ You're on the correct network
3. ✅ You have some ETH for gas
4. ✅ Browser console shows no errors
5. ✅ Internet connection is working
6. ✅ No ad blockers interfering

### Try These:
1. **Hard refresh:** Ctrl+Shift+R (Cmd+Shift+R on Mac)
2. **Clear cache:** Browser settings → Clear browsing data
3. **Restart browser:** Close and reopen
4. **Reset MetaMask:** Settings → Advanced → Reset Account
5. **Try different browser:** Use Chrome if using Firefox, etc.

### Test Sequence:
```
1. Open test-wallet.html
2. Check Environment → Should show all ✅
3. Connect Wallet → Should connect successfully
4. Get Account Info → Should show your details
5. If all work, try main app (index.html)
```

## Advanced Debugging

### Enable Verbose Logging
Open browser console and run:
```javascript
localStorage.setItem('debug', '*');
```

### Check MetaMask Connection
```javascript
console.log('Ethereum:', window.ethereum);
console.log('Is MetaMask:', window.ethereum?.isMetaMask);
```

### Test Connection Manually
```javascript
window.ethereum.request({ method: 'eth_requestAccounts' })
  .then(accounts => console.log('Connected:', accounts))
  .catch(error => console.error('Error:', error));
```

### Check Network
```javascript
window.ethereum.request({ method: 'eth_chainId' })
  .then(chainId => console.log('Chain ID:', chainId));
```

## Getting Help

If you're still stuck:

1. **Check console logs** - Copy any error messages
2. **Note your setup:**
   - Browser and version
   - MetaMask version
   - Operating system
   - Network you're trying to use

3. **Try test-wallet.html** - Note which step fails

4. **Common solutions that work 90% of the time:**
   - Refresh the page
   - Unlock MetaMask
   - Switch to correct network
   - Get testnet ETH from faucet

## Prevention Tips

### For Best Experience:
1. ✅ Use Chrome or Brave browser
2. ✅ Keep MetaMask updated
3. ✅ Test on Sepolia testnet first
4. ✅ Keep some testnet ETH in wallet
5. ✅ Don't use multiple wallet extensions
6. ✅ Keep browser console open to see logs

### Before Going Live:
1. Test thoroughly on testnet
2. Verify all functions work
3. Test with small amounts first
4. Have backup plan if issues arise

---

## Quick Reference

### Installation Links
- MetaMask: https://metamask.io/
- Trust Wallet: https://trustwallet.com/
- Brave Browser: https://brave.com/

### Testnet Faucets
- Sepolia: https://sepoliafaucet.com/
- Mumbai: https://faucet.polygon.technology/
- BSC Testnet: https://testnet.binance.org/faucet-smart

### Block Explorers
- Sepolia: https://sepolia.etherscan.io/
- Mumbai: https://mumbai.polygonscan.com/
- BSC Testnet: https://testnet.bscscan.com/

---

**Remember:** Most wallet connection issues are solved by:
1. Installing/unlocking MetaMask
2. Refreshing the page
3. Switching to correct network
4. Having some ETH for gas

Good luck! 🚀