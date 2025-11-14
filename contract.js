// Contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "_title", "type": "string"},
            {"internalType": "string", "name": "_imageUrl", "type": "string"},
            {"internalType": "uint256", "name": "_entryFee", "type": "uint256"},
            {"internalType": "uint256", "name": "_duration", "type": "uint256"}
        ],
        "name": "createRaffle",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_raffleId", "type": "uint256"},
            {"internalType": "uint256", "name": "_ticketCount", "type": "uint256"}
        ],
        "name": "buyTicket",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_raffleId", "type": "uint256"}],
        "name": "selectWinner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_raffleId", "type": "uint256"}],
        "name": "getRaffleDetails",
        "outputs": [
            {"internalType": "string", "name": "title", "type": "string"},
            {"internalType": "string", "name": "imageUrl", "type": "string"},
            {"internalType": "uint256", "name": "prizePool", "type": "uint256"},
            {"internalType": "uint256", "name": "entryFee", "type": "uint256"},
            {"internalType": "uint256", "name": "endTime", "type": "uint256"},
            {"internalType": "uint256", "name": "participantCount", "type": "uint256"},
            {"internalType": "bool", "name": "isActive", "type": "bool"},
            {"internalType": "bool", "name": "winnerSelected", "type": "bool"},
            {"internalType": "address", "name": "winner", "type": "address"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_raffleId", "type": "uint256"}],
        "name": "getParticipants",
        "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_raffleId", "type": "uint256"},
            {"internalType": "address", "name": "_participant", "type": "address"}
        ],
        "name": "getTicketCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getActiveRaffles",
        "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllRaffles",
        "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "raffleCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "raffleId", "type": "uint256"},
            {"indexed": false, "internalType": "string", "name": "title", "type": "string"},
            {"indexed": false, "internalType": "uint256", "name": "entryFee", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "endTime", "type": "uint256"}
        ],
        "name": "RaffleCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "raffleId", "type": "uint256"},
            {"indexed": true, "internalType": "address", "name": "participant", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "ticketCount", "type": "uint256"}
        ],
        "name": "TicketPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "raffleId", "type": "uint256"},
            {"indexed": true, "internalType": "address", "name": "winner", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "prizeAmount", "type": "uint256"}
        ],
        "name": "WinnerSelected",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "raffleId", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "newPrizePool", "type": "uint256"}
        ],
        "name": "PrizePoolUpdated",
        "type": "event"
    }
];

// Contract address - REPLACE THIS with your deployed contract address
// For testing, you can deploy to a testnet like Sepolia, Mumbai, or use a local blockchain
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // PLACEHOLDER - Replace after deployment

// Network configurations
const NETWORKS = {
    ethereum: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io']
    },
    sepolia: {
        chainId: '0xaa36a7',
        chainName: 'Sepolia Testnet',
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io']
    },
    polygon: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com']
    },
    mumbai: {
        chainId: '0x13881',
        chainName: 'Mumbai Testnet',
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com']
    },
    bsc: {
        chainId: '0x38',
        chainName: 'Binance Smart Chain',
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com']
    },
    bscTestnet: {
        chainId: '0x61',
        chainName: 'BSC Testnet',
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        blockExplorerUrls: ['https://testnet.bscscan.com']
    }
};

// Default network (change this to your preferred network)
const DEFAULT_NETWORK = 'sepolia';