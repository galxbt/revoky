// backend/config/contracts.js

import { ethers } from "ethers";

// -------------------------------------
// EVENT TOPICS
// -------------------------------------

export const APPROVAL_TOPIC0 = ethers.id(
  "Approval(address,address,uint256)"
);

export const APPROVAL_FOR_ALL_TOPIC0 = ethers.id(
  "ApprovalForAll(address,address,bool)"
);

// -------------------------------------
// ERC165 INTERFACE IDS
// -------------------------------------

export const ERC721_INTERFACE_ID =
  "0x80ac58cd";

export const ERC1155_INTERFACE_ID =
  "0xd9b67a26";

// -------------------------------------
// COMMON VALUES
// -------------------------------------

export const MAX_UINT256 =
  (2n ** 256n) - 1n;

export const UNLIMITED_THRESHOLD =
  10n ** 30n;

// -------------------------------------
// MULTICALL3
// Same address on all supported chains
// -------------------------------------

export const MULTICALL3_ADDRESS =
  "0xca11bde05977b3631167028862be2a173976ca11";

export const MULTICALL3_ABI = [
  "function aggregate3(tuple(address target,bool allowFailure,bytes callData)[] calls) view returns (tuple(bool success,bytes returnData)[])",
];

// -------------------------------------
// ERC20 READ ABI
// -------------------------------------

export const ERC20_READ_ABI = [
  "function allowance(address owner,address spender) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function name() view returns (string)",
];

// -------------------------------------
// NFT READ ABI
// Supports both ERC721 & ERC1155
// -------------------------------------

export const NFT_READ_ABI = [
  "function getApproved(uint256 tokenId) view returns (address)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function isApprovedForAll(address owner,address operator) view returns (bool)",
  "function name() view returns (string)",
  "function supportsInterface(bytes4 interfaceId) view returns (bool)",
];