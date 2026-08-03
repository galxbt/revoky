// backend/utils/provider.js

import { ethers } from "ethers";
import { CHAINS } from "../config/chains.js";
import { PROVIDERS } from "../services/caches.js";

// -------------------------------------
// GET PROVIDER
// -------------------------------------

export function getProvider(chainKey) {
  const chain = CHAINS[chainKey];

  if (!chain) {
    throw new Error(
      `Unsupported chain: ${chainKey}`
    );
  }

  if (!PROVIDERS.has(chainKey)) {
    PROVIDERS.set(
      chainKey,
      new ethers.JsonRpcProvider(
        chain.rpc
      )
    );
  }

  return PROVIDERS.get(chainKey);
}

// -------------------------------------
// GET LATEST BLOCK
// -------------------------------------

export async function getLatestBlock(chainKey) {
  return getProvider(chainKey).getBlockNumber();
}

// -------------------------------------
// GET CHAIN CONFIG
// -------------------------------------

export function getChain(chainKey) {
  const chain = CHAINS[chainKey];

  if (!chain) {
    throw new Error(
      `Unsupported chain: ${chainKey}`
    );
  }

  return chain;
}

// -------------------------------------
// GET CHAIN ID
// -------------------------------------

export function getChainId(chainKey) {
  return getChain(chainKey).chainId;
}

// -------------------------------------
// CHECK SUPPORTED CHAIN
// -------------------------------------

export function isSupportedChain(chainKey) {
  return chainKey in CHAINS;
}

// -------------------------------------
// LIST SUPPORTED CHAINS
// -------------------------------------

export function getSupportedChains() {
  return Object.keys(CHAINS);
}