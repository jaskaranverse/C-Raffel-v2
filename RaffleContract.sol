// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title RaffleContract
 * @dev Decentralized raffle system with no signup required
 */
contract RaffleContract {
    
    // Platform fee recipient address
    address payable public platformWallet = payable(0x842bab27de95e329eb17733c1f29c082e5dd94c3);
    uint256 public platformFeePercent = 10; // 10% platform fee
    
    struct Raffle {
        uint256 id;
        string title;
        string imageUrl;
        uint256 prizePool;
        uint256 entryFee;
        uint256 endTime;
        address[] participants;
        mapping(address => uint256) ticketCount;
        bool isActive;
        bool winnerSelected;
        address winner;
        address creator;
    }
    
    mapping(uint256 => Raffle) public raffles;
    uint256 public raffleCount;
    
    event RaffleCreated(uint256 indexed raffleId, string title, uint256 entryFee, uint256 endTime);
    event TicketPurchased(uint256 indexed raffleId, address indexed participant, uint256 ticketCount);
    event WinnerSelected(uint256 indexed raffleId, address indexed winner, uint256 prizeAmount);
    event PrizePoolUpdated(uint256 indexed raffleId, uint256 newPrizePool);
    
    /**
     * @dev Create a new raffle
     * @param _title Title of the raffle
     * @param _imageUrl URL of the prize image
     * @param _entryFee Entry fee in wei
     * @param _duration Duration in seconds
     */
    function createRaffle(
        string memory _title,
        string memory _imageUrl,
        uint256 _entryFee,
        uint256 _duration
    ) external payable returns (uint256) {
        require(_entryFee > 0, "Entry fee must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        
        uint256 raffleId = raffleCount++;
        Raffle storage newRaffle = raffles[raffleId];
        
        newRaffle.id = raffleId;
        newRaffle.title = _title;
        newRaffle.imageUrl = _imageUrl;
        newRaffle.prizePool = msg.value;
        newRaffle.entryFee = _entryFee;
        newRaffle.endTime = block.timestamp + _duration;
        newRaffle.isActive = true;
        newRaffle.winnerSelected = false;
        newRaffle.creator = msg.sender;
        
        emit RaffleCreated(raffleId, _title, _entryFee, newRaffle.endTime);
        
        return raffleId;
    }
    
    /**
     * @dev Buy tickets for a raffle
     * @param _raffleId ID of the raffle
     * @param _ticketCount Number of tickets to purchase
     */
    function buyTicket(uint256 _raffleId, uint256 _ticketCount) external payable {
        Raffle storage raffle = raffles[_raffleId];
        
        require(raffle.isActive, "Raffle is not active");
        require(block.timestamp < raffle.endTime, "Raffle has ended");
        require(_ticketCount > 0, "Must buy at least one ticket");
        require(msg.value == raffle.entryFee * _ticketCount, "Incorrect payment amount");
        
        // Add participant if first time
        if (raffle.ticketCount[msg.sender] == 0) {
            raffle.participants.push(msg.sender);
        }
        
        // Update ticket count
        raffle.ticketCount[msg.sender] += _ticketCount;
        
        // Update prize pool
        raffle.prizePool += msg.value;
        
        emit TicketPurchased(_raffleId, msg.sender, _ticketCount);
        emit PrizePoolUpdated(_raffleId, raffle.prizePool);
    }
    
    /**
     * @dev Select winner for a raffle (can be called by anyone after end time)
     * @param _raffleId ID of the raffle
     */
    function selectWinner(uint256 _raffleId) external {
        Raffle storage raffle = raffles[_raffleId];
        
        require(raffle.isActive, "Raffle is not active");
        require(block.timestamp >= raffle.endTime, "Raffle has not ended yet");
        require(!raffle.winnerSelected, "Winner already selected");
        require(raffle.participants.length > 0, "No participants");
        
        // Generate pseudo-random number based on block data
        uint256 totalTickets = 0;
        for (uint256 i = 0; i < raffle.participants.length; i++) {
            totalTickets += raffle.ticketCount[raffle.participants[i]];
        }
        
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            block.number,
            raffle.participants,
            msg.sender
        ))) % totalTickets;
        
        // Find winner based on weighted random selection
        uint256 currentTicketIndex = 0;
        address selectedWinner;
        
        for (uint256 i = 0; i < raffle.participants.length; i++) {
            address participant = raffle.participants[i];
            currentTicketIndex += raffle.ticketCount[participant];
            
            if (randomNumber < currentTicketIndex) {
                selectedWinner = participant;
                break;
            }
        }
        
        raffle.winner = selectedWinner;
        raffle.winnerSelected = true;
        raffle.isActive = false;
        
        // Transfer prize to winner and platform fee to platform wallet
        uint256 platformFee = (raffle.prizePool * platformFeePercent) / 100;
        uint256 winnerPrize = raffle.prizePool - platformFee;
        
        payable(selectedWinner).transfer(winnerPrize);
        platformWallet.transfer(platformFee);
        
        emit WinnerSelected(_raffleId, selectedWinner, winnerPrize);
    }
    
    /**
     * @dev Get raffle details
     * @param _raffleId ID of the raffle
     */
    function getRaffleDetails(uint256 _raffleId) external view returns (
        string memory title,
        string memory imageUrl,
        uint256 prizePool,
        uint256 entryFee,
        uint256 endTime,
        uint256 participantCount,
        bool isActive,
        bool winnerSelected,
        address winner
    ) {
        Raffle storage raffle = raffles[_raffleId];
        return (
            raffle.title,
            raffle.imageUrl,
            raffle.prizePool,
            raffle.entryFee,
            raffle.endTime,
            raffle.participants.length,
            raffle.isActive,
            raffle.winnerSelected,
            raffle.winner
        );
    }
    
    /**
     * @dev Get all participants for a raffle
     * @param _raffleId ID of the raffle
     */
    function getParticipants(uint256 _raffleId) external view returns (address[] memory) {
        return raffles[_raffleId].participants;
    }
    
    /**
     * @dev Get ticket count for a participant
     * @param _raffleId ID of the raffle
     * @param _participant Address of the participant
     */
    function getTicketCount(uint256 _raffleId, address _participant) external view returns (uint256) {
        return raffles[_raffleId].ticketCount[_participant];
    }
    
    /**
     * @dev Get all active raffles
     */
    function getActiveRaffles() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active raffles
        for (uint256 i = 0; i < raffleCount; i++) {
            if (raffles[i].isActive && block.timestamp < raffles[i].endTime) {
                activeCount++;
            }
        }
        
        // Create array of active raffle IDs
        uint256[] memory activeRaffleIds = new uint256[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < raffleCount; i++) {
            if (raffles[i].isActive && block.timestamp < raffles[i].endTime) {
                activeRaffleIds[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return activeRaffleIds;
    }
    
    /**
     * @dev Get all raffles (active and ended)
     */
    function getAllRaffles() external view returns (uint256[] memory) {
        uint256[] memory allRaffleIds = new uint256[](raffleCount);
        
        for (uint256 i = 0; i < raffleCount; i++) {
            allRaffleIds[i] = i;
        }
        
        return allRaffleIds;
    }
}