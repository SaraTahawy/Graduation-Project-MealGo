// contracts/CouponNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CouponNFT is ERC721, Ownable {
    uint256 public tokenCounter = 0;

    // Optionally: store coupon metadata
    mapping(uint256 => string) public couponCodes;
    mapping(uint256 => uint256) public couponValues;

    event CouponMinted(address indexed to, uint256 indexed tokenId, string code, uint256 value);

    constructor() ERC721("CouponNFT", "CPN") {}

    function mintCoupon(address to, string memory code, uint256 value) public onlyOwner returns (uint256) {
        uint256 tokenId = tokenCounter;
        tokenCounter += 1;
        _safeMint(to, tokenId);
        couponCodes[tokenId] = code;
        couponValues[tokenId] = value;
        emit CouponMinted(to, tokenId, code, value);
        return tokenId;
    }

    function setCouponMetadata(uint256 tokenId, string memory code, uint256 value) public onlyOwner {
        couponCodes[tokenId] = code;
        couponValues[tokenId] = value;
    }
}
