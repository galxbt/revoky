// backend/services/assetStandard.js

import { ethers } from "ethers";
import { debug } from "../utils/logger.js";
import { getProvider } from "../utils/provider.js";
import { getCache, setCache } from "../utils/cache.js";
import { STANDARD_CACHE } from "./caches.js";

import {
  NFT_READ_ABI,
  ERC721_INTERFACE_ID,
  ERC1155_INTERFACE_ID,
} from "../config/contracts.js";

// -------------------------------------
// DETECT NFT STANDARD
// -------------------------------------

async function detectNFTStandard(
  provider,
  assetAddress
) {
  const contract = new ethers.Contract(
    assetAddress,
    NFT_READ_ABI,
    provider
  );

  try {
    // ERC-1155 contracts MUST implement
    // this interface.
    if (
      await contract.supportsInterface(
        ERC1155_INTERFACE_ID
      )
    ) {
      return "ERC-1155";
    }

    // ERC-721 contracts MUST implement
    // this interface.
    if (
      await contract.supportsInterface(
        ERC721_INTERFACE_ID
      )
    ) {
      return "ERC-721";
    }

    return "Unknown";
  } catch {
    return "Unknown";
  }
}

// -------------------------------------
// GET ASSET STANDARD
// -------------------------------------

export async function getAssetStandard({
  chainKey,
  assetType,
  assetAddress,
}) {
  // All fungible token approvals in Revoky
  // are ERC-20 approvals.
  if (assetType === "token") {
    return "ERC-20";
  }

  const address =
    assetAddress.toLowerCase();

  const cacheKey =
    `${chainKey}:${address}`;

  // Retrieve cache
  const cached = getCache(
    "AssetStandard",
    STANDARD_CACHE,
    cacheKey
  );

  if (cached !== null) {
    debug("assetStandard", "[ASSET STANDARD CACHE HIT]");
    return cached;
  }

  const provider =
    getProvider(chainKey);

  const standard =
    await detectNFTStandard(
      provider,
      address
    );

  // Save cache
  setCache(
    STANDARD_CACHE,
    cacheKey,
    standard
  );

  debug("assetStandard", "[ASSET STANDARD NETWORK]");

  return standard;
}

// -------------------------------------
// GET ASSET STANDARDS (BATCH)
// -------------------------------------

export async function getAssetStandards(
  chainKey,
  assetAddresses = []
) {
  const standards = {};

  const uniqueAddresses = [
    ...new Set(
      assetAddresses
        .filter(Boolean)
        .map((a) => a.toLowerCase())
    ),
  ];

  await Promise.all(
    uniqueAddresses.map(async (address) => {
      standards[address] =
        await getAssetStandard({
          chainKey,
          assetType: "nft",
          assetAddress: address,
        });
    })
  );

  return standards;
}