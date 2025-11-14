// Global variables
let provider = null;
let signer = null;
let contract = null;
let currentAccount = null;
let selectedWalletType = null;

// Wait for ethers.js to load
function waitForEthers() {
    return new Promise((resolve) => {
        if (typeof ethers !== 'undefined') {
            resolve();
        } else {
            const checkEthers = setInterval(() => {
                if (typeof ethers !== 'undefined') {
                    clearInterval(checkEthers);
                    resolve();
                }
            }, 100);
        }
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await waitForEthers();
    initializeApp();
});

function initializeApp() {
    console.log('Initializing app...');
    setupEventListeners();
    checkWalletConnection();
    loadRaffles();
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('connectWalletBtn').addEventListener('click', showWalletModal);
    document.getElementById('closeModal').addEventListener('click', hideWalletModal);
    document.getElementById('closeAccountModal').addEventListener('click', hideAccountModal);
    document.getElementById('disconnectBtn').addEventListener('click', disconnectWallet);
    
    // Wallet option buttons
    document.querySelectorAll('.wallet-option').forEach(button => {
        button.addEventListener('click', (e) => {
            const walletType = e.currentTarget.dataset.wallet;
            connectWallet(walletType);
        });
    });
}

// Show wallet selection modal
function showWalletModal() {
    document.getElementById('walletModal').classList.remove('hidden');
}

// Hide wallet selection modal
function hideWalletModal() {
    document.getElementById('walletModal').classList.add('hidden');
}

// Show account selection modal
function showAccountModal(accounts) {
    const accountList = document.getElementById('accountList');
    accountList.innerHTML = '';
    
    accounts.forEach((account, index) => {
        const accountItem = document.createElement('button');
        accountItem.className = 'account-item';
        accountItem.textContent = `Account ${index + 1}: ${formatAddress(account)}`;
        accountItem.addEventListener('click', () => selectAccount(account));
        accountList.appendChild(accountItem);
    });
    
    document.getElementById('accountModal').classList.remove('hidden');
}

// Hide account selection modal
function hideAccountModal() {
    document.getElementById('accountModal').classList.add('hidden');
}

// Connect wallet
async function connectWallet(walletType) {
    try {
        console.log('Attempting to connect wallet:', walletType);
        selectedWalletType = walletType;
        hideWalletModal();
        
        let accounts = [];
        
        switch(walletType) {
            case 'metamask':
                console.log('Checking for MetaMask...');
                if (typeof window.ethereum !== 'undefined') {
                    console.log('MetaMask detected, requesting accounts...');
                    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    console.log('Accounts received:', accounts);
                    provider = new ethers.providers.Web3Provider(window.ethereum);
                    console.log('Provider created successfully');
                } else {
                    console.error('MetaMask not found');
                    alert('MetaMask is not installed. Please install MetaMask extension from https://metamask.io/');
                    return;
                }
                break;
                
            case 'phantom':
                if (typeof window.solana !== 'undefined' && window.solana.isPhantom) {
                    // Phantom is primarily for Solana, but can support Ethereum
                    alert('Phantom wallet detected. For Ethereum raffles, please use MetaMask or WalletConnect.');
                    return;
                } else {
                    alert('Phantom wallet is not installed.');
                    return;
                }
                break;
                
            case 'trustwallet':
                console.log('Checking for Trust Wallet...');
                // Trust Wallet uses WalletConnect or injected provider
                if (typeof window.ethereum !== 'undefined') {
                    console.log('Trust Wallet detected, requesting accounts...');
                    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    provider = new ethers.providers.Web3Provider(window.ethereum);
                    console.log('Trust Wallet connected successfully');
                } else {
                    console.error('Trust Wallet not found');
                    alert('Trust Wallet not detected. Please use WalletConnect option or open in Trust Wallet browser.');
                    return;
                }
                break;
                
            case 'walletconnect':
                alert('WalletConnect integration requires additional setup. Please use MetaMask or Trust Wallet for now.');
                return;
                
            default:
                alert('Wallet type not supported yet.');
                return;
        }
        
        console.log('Total accounts found:', accounts.length);
        
        if (accounts.length > 1) {
            console.log('Multiple accounts found, showing selection modal');
            showAccountModal(accounts);
        } else if (accounts.length === 1) {
            console.log('Single account found, selecting automatically');
            await selectAccount(accounts[0]);
        } else {
            console.error('No accounts found');
            alert('No accounts found. Please make sure your wallet is unlocked and has at least one account.');
        }
        
    } catch (error) {
        console.error('Error connecting wallet:', error);
        if (error.code === 4001) {
            alert('Connection request was rejected. Please try again and approve the connection.');
        } else {
            alert('Failed to connect wallet: ' + error.message);
        }
    }
}

// Select account
async function selectAccount(account) {
    try {
        console.log('Selecting account:', account);
        hideAccountModal();
        currentAccount = account;
        
        console.log('Getting signer...');
        signer = provider.getSigner();
        
        console.log('Creating contract instance...');
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        console.log('Updating UI...');
        // Update UI
        const connectBtn = document.getElementById('connectWalletBtn');
        const walletInfo = document.getElementById('walletInfo');
        const walletAddress = document.getElementById('walletAddress');
        
        if (connectBtn) connectBtn.classList.add('hidden');
        if (walletInfo) walletInfo.classList.remove('hidden');
        if (walletAddress) walletAddress.textContent = formatAddress(currentAccount);
        
        console.log('Wallet connected successfully!');
        console.log('Connected address:', currentAccount);
        
        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
            console.log('Event listeners attached');
        }
        
        // Reload raffles
        console.log('Loading raffles...');
        await loadRaffles();
        
    } catch (error) {
        console.error('Error selecting account:', error);
        alert('Failed to select account: ' + error.message);
    }
}

// Handle account changes
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
    } else if (accounts[0] !== currentAccount) {
        selectAccount(accounts[0]);
    }
}

// Handle chain changes
function handleChainChanged() {
    window.location.reload();
}

// Disconnect wallet
function disconnectWallet() {
    currentAccount = null;
    provider = null;
    signer = null;
    contract = null;
    
    document.getElementById('connectWalletBtn').classList.remove('hidden');
    document.getElementById('walletInfo').classList.add('hidden');
    
    if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
}

// Check if wallet is already connected
async function checkWalletConnection() {
    console.log('Checking for existing wallet connection...');
    
    if (typeof window.ethereum !== 'undefined') {
        console.log('Ethereum provider detected');
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            console.log('Existing accounts:', accounts);
            
            if (accounts.length > 0) {
                console.log('Found existing connection, auto-connecting...');
                provider = new ethers.providers.Web3Provider(window.ethereum);
                await selectAccount(accounts[0]);
            } else {
                console.log('No existing connection found');
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
        }
    } else {
        console.log('No Ethereum provider detected. Please install MetaMask.');
    }
}

// Load raffles from contract
async function loadRaffles() {
    try {
        const raffleContainer = document.getElementById('raffleContainer');
        const noRaffles = document.getElementById('noRaffles');
        
        // For demo purposes, create sample raffles if contract is not deployed
        if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
            createDemoRaffles();
            return;
        }
        
        // Get contract instance for reading (no signer needed)
        const readProvider = provider || new ethers.providers.JsonRpcProvider(NETWORKS[DEFAULT_NETWORK].rpcUrls[0]);
        const readContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, readProvider);
        
        const raffleIds = await readContract.getAllRaffles();
        
        if (raffleIds.length === 0) {
            raffleContainer.innerHTML = '';
            noRaffles.classList.remove('hidden');
            return;
        }
        
        noRaffles.classList.add('hidden');
        raffleContainer.innerHTML = '';
        
        for (let i = 0; i < raffleIds.length; i++) {
            const raffleId = raffleIds[i];
            const raffleDetails = await readContract.getRaffleDetails(raffleId);
            const participants = await readContract.getParticipants(raffleId);
            
            createRaffleCard({
                id: raffleId.toNumber(),
                title: raffleDetails.title,
                imageUrl: raffleDetails.imageUrl,
                prizePool: ethers.utils.formatEther(raffleDetails.prizePool),
                entryFee: ethers.utils.formatEther(raffleDetails.entryFee),
                endTime: raffleDetails.endTime.toNumber(),
                participantCount: raffleDetails.participantCount.toNumber(),
                isActive: raffleDetails.isActive,
                winnerSelected: raffleDetails.winnerSelected,
                winner: raffleDetails.winner,
                participants: participants
            });
        }
        
    } catch (error) {
        console.error('Error loading raffles:', error);
        createDemoRaffles();
    }
}

// Create demo raffles for testing
function createDemoRaffles() {
    const raffleContainer = document.getElementById('raffleContainer');
    const noRaffles = document.getElementById('noRaffles');
    
    noRaffles.classList.add('hidden');
    raffleContainer.innerHTML = '';
    
    const demoRaffles = [
        {
            id: 1,
            title: "Luxury Sports Car Raffle",
            imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500",
            prizePool: "10.5",
            entryFee: "0.1",
            endTime: Date.now() / 1000 + 86400 * 3, // 3 days from now
            participantCount: 45,
            isActive: true,
            winnerSelected: false,
            winner: "0x0000000000000000000000000000000000000000",
            participants: []
        },
        {
            id: 2,
            title: "1 ETH Prize Pool",
            imageUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=500",
            prizePool: "1.0",
            entryFee: "0.05",
            endTime: Date.now() / 1000 + 86400 * 7, // 7 days from now
            participantCount: 20,
            isActive: true,
            winnerSelected: false,
            winner: "0x0000000000000000000000000000000000000000",
            participants: []
        },
        {
            id: 3,
            title: "NFT Collection Raffle",
            imageUrl: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=500",
            prizePool: "5.2",
            entryFee: "0.02",
            endTime: Date.now() / 1000 + 86400 * 1, // 1 day from now
            participantCount: 150,
            isActive: true,
            winnerSelected: false,
            winner: "0x0000000000000000000000000000000000000000",
            participants: []
        }
    ];
    
    demoRaffles.forEach(raffle => createRaffleCard(raffle));
}

// Create raffle card
function createRaffleCard(raffle) {
    const template = document.getElementById('raffleTemplate');
    const clone = template.content.cloneNode(true);
    
    // Set raffle details
    clone.querySelector('.raffle-image img').src = raffle.imageUrl;
    clone.querySelector('.raffle-image img').alt = raffle.title;
    clone.querySelector('.raffle-title').textContent = raffle.title;
    clone.querySelector('.prize-pool').textContent = `${raffle.prizePool} ETH`;
    clone.querySelector('.entry-fee').textContent = `${raffle.entryFee} ETH`;
    clone.querySelector('.participants').textContent = raffle.participantCount;
    
    // Setup countdown
    const countdownTimer = clone.querySelector('.countdown-timer');
    updateCountdown(countdownTimer, raffle.endTime);
    
    // Setup buy ticket button
    const buyButton = clone.querySelector('.buy-ticket-btn');
    buyButton.dataset.raffleId = raffle.id;
    buyButton.dataset.entryFee = raffle.entryFee;
    
    if (!raffle.isActive || raffle.winnerSelected) {
        buyButton.disabled = true;
        buyButton.textContent = 'Raffle Ended';
    }
    
    buyButton.addEventListener('click', () => buyTicket(raffle.id, raffle.entryFee));
    
    // Show participants
    const participantsList = clone.querySelector('.participants-list');
    if (raffle.participants && raffle.participants.length > 0) {
        raffle.participants.forEach(async (participant) => {
            const participantItem = document.createElement('div');
            participantItem.className = 'participant-item';
            
            const address = document.createElement('span');
            address.className = 'address';
            address.textContent = formatAddress(participant);
            
            participantItem.appendChild(address);
            participantsList.appendChild(participantItem);
        });
    } else {
        participantsList.innerHTML = '<p style="color: #9ca3af; text-align: center;">No participants yet</p>';
    }
    
    // Show winner if selected
    if (raffle.winnerSelected && raffle.winner !== "0x0000000000000000000000000000000000000000") {
        const winnerAnnouncement = clone.querySelector('.winner-announcement');
        winnerAnnouncement.classList.remove('hidden');
        clone.querySelector('.winner-address').textContent = raffle.winner;
        buyButton.style.display = 'none';
    }
    
    document.getElementById('raffleContainer').appendChild(clone);
}

// Update countdown timer
function updateCountdown(timerElement, endTime) {
    function update() {
        const now = Date.now() / 1000;
        const timeLeft = endTime - now;
        
        if (timeLeft <= 0) {
            timerElement.querySelector('.days').textContent = '00';
            timerElement.querySelector('.hours').textContent = '00';
            timerElement.querySelector('.minutes').textContent = '00';
            timerElement.querySelector('.seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(timeLeft / 86400);
        const hours = Math.floor((timeLeft % 86400) / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = Math.floor(timeLeft % 60);
        
        timerElement.querySelector('.days').textContent = String(days).padStart(2, '0');
        timerElement.querySelector('.hours').textContent = String(hours).padStart(2, '0');
        timerElement.querySelector('.minutes').textContent = String(minutes).padStart(2, '0');
        timerElement.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    update();
    setInterval(update, 1000);
}

// Buy ticket
async function buyTicket(raffleId, entryFee) {
    if (!currentAccount) {
        alert('Please connect your wallet first!');
        showWalletModal();
        return;
    }
    
    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        alert('Demo Mode: Contract not deployed yet. Please deploy the smart contract first.\n\nSee deployment instructions in the README file.');
        return;
    }
    
    try {
        const ticketCount = prompt('How many tickets would you like to buy?', '1');
        if (!ticketCount || ticketCount <= 0) return;
        
        const totalCost = ethers.utils.parseEther((parseFloat(entryFee) * parseInt(ticketCount)).toString());
        
        const tx = await contract.buyTicket(raffleId, ticketCount, {
            value: totalCost
        });
        
        alert('Transaction submitted! Waiting for confirmation...');
        
        await tx.wait();
        
        alert('Ticket purchased successfully!');
        
        // Reload raffles
        await loadRaffles();
        
    } catch (error) {
        console.error('Error buying ticket:', error);
        alert('Failed to buy ticket: ' + error.message);
    }
}

// Format address for display
function formatAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Utility function to switch network
async function switchNetwork(networkName) {
    if (!window.ethereum) return;
    
    const network = NETWORKS[networkName];
    if (!network) return;
    
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: network.chainId }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [network],
                });
            } catch (addError) {
                console.error('Error adding network:', addError);
            }
        }
    }
}