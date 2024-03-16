// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract BaseNFT is ERC721URIStorage, Ownable {
    // Counter to keep track of minted tickets.
    uint256 private mintedTicketCount;

    // Price of each mint
    uint256 public MINT_PRICE = 0.01 ether;

    // We need to pass the name of our NFTs token and its symbol.
    constructor() ERC721("Base NFT for frames", "BASE") {
        console.log("Please work!");
    }

    function setMintPrice(uint256 _price) external onlyOwner {
        MINT_PRICE = _price;
    }

    // A function our user will hit to get their NFT.
    function mintNFTTicket() public payable {
        require(msg.value >= MINT_PRICE, "Insufficient payment");

        // Get the current tokenId, this starts at 0.
        uint256 newTicketId = mintedTicketCount;

        // Actually mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newTicketId);

        // Return the NFT's metadata
        _setTokenURI(
            newTicketId,
            "ipfs://QmdfN2FMJSisBBprxG6QJUVR3spvXhuY68uNCuP3GKd5cX"
        );

        // Increment counter when next NFT ticket is minted
        mintedTicketCount++;
    }
}