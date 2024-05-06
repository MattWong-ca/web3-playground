// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IOracle {
    function createLlmCall(uint promptId) external returns (uint);
}

struct Message {
    string role;
    string content;
}

struct ChatRun {
    address owner;
    Message[] messages;
    uint messagesCount;
}

contract ChatGpt {
    address private owner;
    address public oracleAddress;

    constructor(address initialOracleAddress) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    event OracleAddressUpdated(address indexed newOracleAddress);

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    event ChatCreated(address indexed owner, uint indexed chatId);
    mapping(uint => ChatRun) public chatRuns;
    uint private chatRunsCount;

    function startChat(string memory message) public returns (uint i) {
        ChatRun storage run = chatRuns[chatRunsCount];

        run.owner = msg.sender;
        Message memory newMessage;
        newMessage.content = message;
        newMessage.role = "user";
        run.messages.push(newMessage);
        run.messagesCount = 1;

        uint currentId = chatRunsCount;
        chatRunsCount = chatRunsCount + 1;

        IOracle(oracleAddress).createLlmCall(currentId);
        emit ChatCreated(msg.sender, currentId);

        return currentId;
    }
}
