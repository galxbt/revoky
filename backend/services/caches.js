import { LRUCache } from "../utils/cache.js";

// -------------------------------------
// BLOCKCHAIN
// -------------------------------------

export const TOKEN_PRICE_CACHE = new LRUCache(10000);

export const TOKEN_METADATA_CACHE = new LRUCache(20000);

export const TOKEN_BALANCE_CACHE = new LRUCache(10000);

export const NFT_BALANCE_CACHE = new LRUCache(10000);

export const NFT_COLLECTION_CACHE = new LRUCache(20000);

export const IN_FLIGHT = new Map();

// -------------------------------------
// ADDRESS ANALYSIS
// -------------------------------------

export const ADDRESS_ANALYSIS_CACHE = new LRUCache(20000);

// -------------------------------------
// ENS
// -------------------------------------

export const ENS_NAME_CACHE = new LRUCache(10000);

export const ENS_LOOKUP_CACHE = new LRUCache(20000);

// -------------------------------------
// CONTRACTS
// -------------------------------------

export const CONTRACT_NAME_CACHE = new LRUCache(10000);

export const STANDARD_CACHE = new LRUCache(10000);

// -------------------------------------
// PROVIDERS
// -------------------------------------

export const PROVIDERS = new Map();

// -------------------------------------
// SCAN
// -------------------------------------

export const SCAN_CACHE = new Map();

// -------------------------------------
// CACHE REGISTRY
// -------------------------------------

export const CACHES = {
  TokenPrice: {
    type: "LRU",
    description: "Token price cache",
    cache: TOKEN_PRICE_CACHE,
  },

  TokenBalance: {
    type: "LRU",
    description: "Token balance cache",
    cache: TOKEN_BALANCE_CACHE,
  },

  TokenMetadata: {
    type: "LRU",
    description: "Token metadata cache",
    cache: TOKEN_METADATA_CACHE,
  },

  NFTBalance: {
    type: "LRU",
    description: "NFT balance cache",
    cache: NFT_BALANCE_CACHE,
  },

  NFTCollection: {
    type: "LRU",
    description: "NFT collection metadata cache",
    cache: NFT_COLLECTION_CACHE,
  },

  ENSName: {
    type: "LRU",
    description: "ENS name cache",
    cache: ENS_NAME_CACHE,
  },

  ENSLookup: {
    type: "LRU",
    description: "ENS lookup cache",
    cache: ENS_LOOKUP_CACHE,
  },

  ContractName: {
    type: "LRU",
    description: "Contract name cache",
    cache: CONTRACT_NAME_CACHE,
  },

  AssetStandard: {
    type: "LRU",
    description: "Asset standard detection cache",
    cache: STANDARD_CACHE,
  },

  Scan: {
    type: "Map",
    description: "Wallet scan result cache",
    cache: SCAN_CACHE,
  },

  Providers: {
    type: "Map",
    description: "RPC provider cache",
    cache: PROVIDERS,
  },

  InFlight: {
    type: "Map",
    description: "In-flight request deduplication cache",
    cache: IN_FLIGHT,
  },

  AddressAnalysis: {
    type: "LRU",
    description: "Address analysis cache",
    cache: ADDRESS_ANALYSIS_CACHE,
  },
};