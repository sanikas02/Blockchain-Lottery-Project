// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GameRoom {
    uint256 public constant STAKE_AMOUNT = 0.01 ether;
    uint256 public constant PRIZE_AMOUNT = 0.04 ether;
    uint256 public constant MAX_PLAYERS = 4;
    
    struct Room {
        string roomId;
        address[] players;
        uint256[] stakes;
        bool roomFinalized;
        address winner;
        uint256 createdAt;
    }
    
    mapping(string => Room) public rooms;
    mapping(string => mapping(address => bool)) public playerInRoom;
    
    event RoomCreated(string indexed roomId, address indexed creator, uint256 timestamp);
    event PlayerJoined(string indexed roomId, address indexed player, uint256 playerCount, uint256 timestamp);
    event GameFinalized(string indexed roomId, address indexed winner, uint256 prizeAmount, uint256 timestamp);
    event WinnerSelected(string indexed roomId, address indexed winner);
    
    modifier roomExists(string memory _roomId) {
        require(rooms[_roomId].createdAt > 0, "Room does not exist");
        _;
    }
    
    modifier notAlreadyInRoom(string memory _roomId) {
        require(!playerInRoom[_roomId][msg.sender], "Player already in this room");
        _;
    }
    
    modifier roomNotFull(string memory _roomId) {
        require(rooms[_roomId].players.length < MAX_PLAYERS, "Room is full");
        _;
    }
    
    modifier correctStake() {
        require(msg.value == STAKE_AMOUNT, "Incorrect stake amount");
        _;
    }
    
    modifier roomNotFinalized(string memory _roomId) {
        require(!rooms[_roomId].roomFinalized, "Room is already finalized");
        _;
    }
    
    function createRoom(string memory _roomId) external payable correctStake {
        require(bytes(_roomId).length == 4, "Room ID must be 4 characters");
        require(rooms[_roomId].createdAt == 0, "Room already exists");
        
        Room storage newRoom = rooms[_roomId];
        newRoom.roomId = _roomId;
        newRoom.createdAt = block.timestamp;
        
        newRoom.players.push(msg.sender);
        newRoom.stakes.push(msg.value);
        playerInRoom[_roomId][msg.sender] = true;
        
        emit RoomCreated(_roomId, msg.sender, block.timestamp);
        emit PlayerJoined(_roomId, msg.sender, 1, block.timestamp);
    }
    
    function joinRoom(string memory _roomId) external payable 
        roomExists(_roomId) 
        notAlreadyInRoom(_roomId) 
        roomNotFull(_roomId) 
        roomNotFinalized(_roomId)
        correctStake 
    {
        Room storage room = rooms[_roomId];
        room.players.push(msg.sender);
        room.stakes.push(msg.value);
        playerInRoom[_roomId][msg.sender] = true;
        
        uint256 playerCount = room.players.length;
        emit PlayerJoined(_roomId, msg.sender, playerCount, block.timestamp);
        
        // Auto-finalize when 4 players joined
        if (playerCount == MAX_PLAYERS) {
            finalizeGame(_roomId);
        }
    }
    
    function finalizeGame(string memory _roomId) public roomExists(_roomId) roomNotFinalized(_roomId) {
        Room storage room = rooms[_roomId];
        require(room.players.length == MAX_PLAYERS, "Need exactly 4 players to finalize");
        
        // Select random winner
        uint256 winnerIndex = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao, _roomId))
        ) % MAX_PLAYERS;
        
        address winner = room.players[winnerIndex];
        room.winner = winner;
        room.roomFinalized = true;
        
        emit WinnerSelected(_roomId, winner);
        
        // Transfer prize to winner (4 stakes)
        (bool success, ) = payable(winner).call{value: PRIZE_AMOUNT}("");
        require(success, "Prize transfer failed");
        
        emit GameFinalized(_roomId, winner, PRIZE_AMOUNT, block.timestamp);
    }
    
    function getRoomDetails(string memory _roomId) external view roomExists(_roomId) 
        returns (
            string memory roomId,
            address[] memory players,
            uint256 playerCount,
            bool isFinalized,
            address winner,
            uint256 createdAt
        ) 
    {
        Room storage room = rooms[_roomId];
        return (
            room.roomId,
            room.players,
            room.players.length,
            room.roomFinalized,
            room.winner,
            room.createdAt
        );
    }
    
    function getPlayerCount(string memory _roomId) external view roomExists(_roomId) returns (uint256) {
        return rooms[_roomId].players.length;
    }
    
    function isPlayerInRoom(string memory _roomId, address _player) external view returns (bool) {
        return playerInRoom[_roomId][_player];
    }
    
    function getRoomWinner(string memory _roomId) external view roomExists(_roomId) returns (address) {
        return rooms[_roomId].winner;
    }
    
    // Receive function to allow contract to receive ETH
    receive() external payable {}
}
