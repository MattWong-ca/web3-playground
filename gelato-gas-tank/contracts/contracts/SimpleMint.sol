// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";
import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @title SimpleMint
 * @dev A simple minting contract that supports ERC2771 for gasless transactions
 * Users can mint tokens to any address, and the contract tracks minting stats
 */
contract SimpleMint is ERC2771Context {
    // Events
    event TokenMinted(address indexed minter, address indexed recipient, uint256 tokenId);
    event BatchMinted(address indexed minter, address indexed recipient, uint256 quantity);
    
    // State variables
    uint256 public totalSupply;
    uint256 public nextTokenId = 1;
    
    // Mapping from token ID to owner
    mapping(uint256 => address) public ownerOf;
    
    // Mapping from owner to token count
    mapping(address => uint256) public balanceOf;
    
    // Mapping to track how many tokens each address has minted
    mapping(address => uint256) public mintedBy;
    
    // Optional: Mint limits
    uint256 public constant MAX_MINT_PER_USER = 10;
    uint256 public constant MAX_TOTAL_SUPPLY = 1000;
    
    /**
     * @dev Constructor sets the trusted forwarder for ERC2771
     * @param trustedForwarder The address of Gelato's trusted forwarder
     */
    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}
    
    /**
     * @dev Mint a single token to the specified recipient
     * @param recipient The address to receive the minted token
     */
    function mint(address recipient) external {
        require(recipient != address(0), "SimpleMint: mint to zero address");
        require(totalSupply < MAX_TOTAL_SUPPLY, "SimpleMint: max supply reached");
        require(mintedBy[_msgSender()] < MAX_MINT_PER_USER, "SimpleMint: max mint per user reached");
        
        uint256 tokenId = nextTokenId;
        
        // Update state
        ownerOf[tokenId] = recipient;
        balanceOf[recipient]++;
        mintedBy[_msgSender()]++;
        totalSupply++;
        nextTokenId++;
        
        emit TokenMinted(_msgSender(), recipient, tokenId);
    }
    
    /**
     * @dev Mint a single token to the caller
     */
    function mintToSelf() external {
        address recipient = _msgSender();
        require(recipient != address(0), "SimpleMint: mint to zero address");
        require(totalSupply < MAX_TOTAL_SUPPLY, "SimpleMint: max supply reached");
        require(mintedBy[recipient] < MAX_MINT_PER_USER, "SimpleMint: max mint per user reached");
        
        uint256 tokenId = nextTokenId;
        
        // Update state
        ownerOf[tokenId] = recipient;
        balanceOf[recipient]++;
        mintedBy[recipient]++;
        totalSupply++;
        nextTokenId++;
        
        emit TokenMinted(recipient, recipient, tokenId);
    }
    
    /**
     * @dev Mint multiple tokens to the specified recipient
     * @param recipient The address to receive the minted tokens
     * @param quantity The number of tokens to mint
     */
    function batchMint(address recipient, uint256 quantity) external {
        require(recipient != address(0), "SimpleMint: mint to zero address");
        require(quantity > 0 && quantity <= 5, "SimpleMint: invalid quantity (1-5)");
        require(totalSupply + quantity <= MAX_TOTAL_SUPPLY, "SimpleMint: would exceed max supply");
        require(mintedBy[_msgSender()] + quantity <= MAX_MINT_PER_USER, "SimpleMint: would exceed max mint per user");
        
        uint256 startTokenId = nextTokenId;
        
        // Update state
        for (uint256 i = 0; i < quantity; i++) {
            ownerOf[startTokenId + i] = recipient;
        }
        
        balanceOf[recipient] += quantity;
        mintedBy[_msgSender()] += quantity;
        totalSupply += quantity;
        nextTokenId += quantity;
        
        emit BatchMinted(_msgSender(), recipient, quantity);
    }
    
    /**
     * @dev Get the minter (original sender) of a transaction
     * This demonstrates that _msgSender() returns the original user, not the relayer
     */
    function getMinter() external view returns (address) {
        return _msgSender();
    }
    
    /**
     * @dev Check how many tokens a user can still mint
     */
    function remainingMintsFor(address user) external view returns (uint256) {
        uint256 minted = mintedBy[user];
        return minted >= MAX_MINT_PER_USER ? 0 : MAX_MINT_PER_USER - minted;
    }
    
    /**
     * @dev Check if minting is still available
     */
    function mintingAvailable() external view returns (bool) {
        return totalSupply < MAX_TOTAL_SUPPLY;
    }
    
    /**
     * @dev Override _msgSender to use ERC2771Context implementation
     * This ensures we get the original sender, not the relayer
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
