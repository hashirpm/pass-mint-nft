// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.9.3/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.9.3/utils/Counters.sol";

contract PassNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 private latestKey; //Store the latest available PassKey

    constructor() ERC721("PassNFT", "PNT") {
        latestKey=0;
    }

    //Validate if the key is valid
    modifier onlyValidKey(uint256 _key) {
        require(_key != 0 && latestKey == _key, "Invalid PassKey");
        _;
    }

    function mintNFT(uint256 _key) public onlyValidKey(_key) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        latestKey = 0; //Set key to 0
    }

    //Function for owner to generate a Key
    function generateKey() public onlyOwner returns (uint256) {
        uint256 newKey = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, block.difficulty)
            )
        );
        latestKey = newKey; //Set the latest available key to the one generated
        return newKey;
    }

    //Funtion that returns latestKey
    function getKey() public view onlyOwner returns (uint256) {
        return latestKey;
    }
}
