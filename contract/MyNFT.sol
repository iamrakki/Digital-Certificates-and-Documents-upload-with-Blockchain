// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => string) private _ipfsHashes;
    mapping(uint256 => address) private _tokenOwners;

    constructor() ERC721("MyNFT", "NFT") {}

    function mint(address[] memory to, string[] memory ipfsHashes) external {
        require(to.length == ipfsHashes.length, "Array length mismatch");

        for (uint256 i = 0; i < to.length; i++) {
            _tokenIds.increment();
            uint256 tokenId = _tokenIds.current();
            _safeMint(to[i], tokenId);
            _ipfsHashes[tokenId] = ipfsHashes[i];
            _tokenOwners[tokenId] = to[i];
        }
    } 

    function getTokenData(uint256 tokenId) external view returns (string memory ipfsHash, address owner) {
        require(_exists(tokenId), "Token does not exist");
        return (_ipfsHashes[tokenId], _tokenOwners[tokenId]);
    }
}
