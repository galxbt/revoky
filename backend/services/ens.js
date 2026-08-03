// backend/services/ens.js

import { createPublicClient, http, toCoinType } from "viem";
import { mainnet, base, arbitrum, optimism } from "viem/chains";
import { normalize } from "viem/ens";

import { CHAINS } from "../config/chains.js";
import { CACHE_CONFIG } from "../config/cache.js";
import { debug } from "../utils/logger.js";
import { getCache, setCache } from "../utils/cache.js";
import { ENS_NAME_CACHE, ENS_LOOKUP_CACHE } from "./caches.js";

const { METADATA_TTL } = CACHE_CONFIG;

// -------------------------------------
// ENS CLIENT — ENSIP-19
// -------------------------------------

const client = createPublicClient({ 
  chain: mainnet,
  transport: http(CHAINS.ethereum.rpc), 
});

// -------------------------------------
// ENSIP-19 COIN TYPES
// -------------------------------------

const COIN_TYPES = {
  ethereum: null,
  base: toCoinType(base.id),
  arbitrum: toCoinType(arbitrum.id),
  optimism: toCoinType(optimism.id),
};

// -------------------------------------
// ENS -> ADDRESS
// -------------------------------------

export async function resolveENSName(
  name,
  chainKey = "ethereum",
) {
  try {
    // Validate chain
    if (!(chainKey in COIN_TYPES)) {
      debug("ensResolve", "[ENS RESOLVE] Unsupported chain:", chainKey);
      return null;
    }

    const normalized = normalize(name);

    // Restrict Base names to Base chain only
    if (normalized.endsWith(".base.eth") && chainKey !== "base") {
      debug("ensResolve", "[ENS RESOLVE] Base name used on non-Base chain:", chainKey);
      return null;
    }

    const cacheKey = `${chainKey}:${normalized}`;

    // Retrieve cache
    const cached = getCache(
      "ENSName",
      ENS_NAME_CACHE,
      cacheKey,
      METADATA_TTL,
    );

    if (cached !== null) {
      debug("ensResolve", "[ENS RESOLVE CACHE HIT]");
      return cached;
    }

    const coinType = COIN_TYPES[chainKey];

    let address = null;

    // ENSIP-19
    if (coinType) {
      address = await client.getEnsAddress({
        name: normalized,
        coinType,
      });
    }

    // Ethereum
    else {
      address = await client.getEnsAddress({
        name: normalized,
      });
    }

    // Save cache
    setCache(
      ENS_NAME_CACHE,
      cacheKey,
      address || null,
    );

    debug("ensResolve", "[ENS RESOLVE NETWORK]");

    return address || null;

  } catch {
    return null;
  }
}

// -------------------------------------
// ADDRESS -> ENS
// -------------------------------------

export async function lookupENS(
  address,
  chainKey = "ethereum"
) {
  try {
    // Validate chain
    if (!(chainKey in COIN_TYPES)) {
      debug("ensLookup", "[ENS LOOKUP] Unsupported chain:", chainKey);
      return null;
    }

    const normalized = address.toLowerCase();
    const cacheKey = `${chainKey}:${normalized}`;

    // Retrieve cache
    const cached = getCache( 
      "ENSLookup",
      ENS_LOOKUP_CACHE, 
      cacheKey, 
      METADATA_TTL,
    );
  
    if (cached !== null) {
      debug("ensLookup", "[ENS LOOKUP CACHE HIT]");
      return cached;
    }

    const coinType = COIN_TYPES[chainKey];

    let ens = null;

    // ENSIP-19
    if (coinType) {
      ens = await client.getEnsName({ 
        address, 
        coinType, 
      }); 
    }

    // Ethereum
    else {
      ens = await client.getEnsName({ 
        address, 
      });
    }

    // Save cache
    setCache( 
      ENS_LOOKUP_CACHE, 
      cacheKey, 
      ens || null,
    );

    debug("ensLookup", "[ENS LOOKUP NETWORK]");

    return ens || null;

  } catch {
    return null;
  }
}