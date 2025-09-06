// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";

/**
 * @title SimpleTest
 * @dev A minimal contract to test ERC2771 sponsored transactions
 */
contract SimpleTest is ERC2771Context {
    // Events
    event ButtonClicked(address indexed clicker, uint256 timestamp);
    
    // State variables
    uint256 public clickCount;
    mapping(address => uint256) public userClickCount;
    address public lastClicker;
    uint256 public lastClickTime;
    
    /**
     * @dev Constructor sets the trusted forwarder for ERC2771
     * @param trustedForwarder The address of Gelato's trusted forwarder
     */
    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}
    
    /**
     * @dev Simple function to test sponsored transactions
     * Anyone can call this, and it tracks who called it
     */
    function clickButton() external {
        address clicker = _msgSender(); // This should return the original user, not the relayer
        
        clickCount++;
        userClickCount[clicker]++;
        lastClicker = clicker;
        lastClickTime = block.timestamp;
        
        emit ButtonClicked(clicker, block.timestamp);
    }
    
    /**
     * @dev Get the current clicker (should return original user, not relayer)
     */
    function getCurrentClicker() external view returns (address) {
        return _msgSender();
    }
    
    /**
     * @dev Get click stats for a user
     */
    function getUserStats(address user) external view returns (uint256 clicks, bool isLastClicker) {
        return (userClickCount[user], lastClicker == user);
    }
    
    /**
     * @dev Override _msgSender to use ERC2771Context implementation
     */
    function _msgSender() internal view override returns (address sender) {
        return ERC2771Context._msgSender();
    }
    
    /**
     * @dev Override _msgData to use ERC2771Context implementation
     */
    function _msgData() internal view override returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
}
