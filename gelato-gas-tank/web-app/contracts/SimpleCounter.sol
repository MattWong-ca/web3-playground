// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SimpleCounter
 * @dev A simple counter contract for testing Gelato sponsored transactions
 * This version does NOT use ERC2771 - it's the simpler implementation
 */
contract SimpleCounter {
    uint256 public counter;
    mapping(address => uint256) public userCounters;
    
    event CounterIncremented(address indexed user, uint256 newValue, uint256 globalCounter);
    event CounterDecremented(address indexed user, uint256 newValue);
    event CounterReset(address indexed user);

    /**
     * @dev Increment the global counter and user's personal counter
     */
    function increment() external {
        counter++;
        userCounters[msg.sender]++;
        emit CounterIncremented(msg.sender, userCounters[msg.sender], counter);
    }

    /**
     * @dev Decrement the user's personal counter (cannot go below 0)
     */
    function decrement() external {
        if (userCounters[msg.sender] > 0) {
            userCounters[msg.sender]--;
            emit CounterDecremented(msg.sender, userCounters[msg.sender]);
        }
    }

    /**
     * @dev Reset the user's personal counter to 0
     */
    function reset() external {
        userCounters[msg.sender] = 0;
        emit CounterReset(msg.sender);
    }

    /**
     * @dev Get the current global counter value
     */
    function getCounter() external view returns (uint256) {
        return counter;
    }

    /**
     * @dev Get a user's personal counter value
     */
    function getUserCounter(address user) external view returns (uint256) {
        return userCounters[user];
    }
}
