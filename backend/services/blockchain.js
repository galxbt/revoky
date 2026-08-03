// backend/services/blockchain.js

import { ethers } from "ethers";
import { CACHE_CONFIG } from "../config/cache.js";
import { getChain } from "../utils/provider.js";
import { debug } from "../utils/logger.js";

import { 
  executeMulticall, 
  safeDecode,
} from "../utils/multicall.js";

import { 
  getCache, 
  setCache,
} from "../utils/cache.js";

import {
  TOKEN_PRICE_CACHE,
  TOKEN_METADATA_CACHE,
  TOKEN_BALANCE_CACHE,
  NFT_BALANCE_CACHE,
  NFT_COLLECTION_CACHE,
  IN_FLIGHT,
} from "./caches.js";

const {
  PRICE_TTL,
  BALANCE_TTL,
  METADATA_TTL,
  DISABLE,
} = CACHE_CONFIG;

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;

// -------------------------------------
// DEDUPE
// -------------------------------------

async function fetchWithDedup(
  key,
  fn
) {
  if (DISABLE) { 
    return fn(); 
  }

  if (IN_FLIGHT.has(key)) {
    return IN_FLIGHT.get(key);
  }

  const promise = fn().finally(() => {
      IN_FLIGHT.delete(key);
    });

  IN_FLIGHT.set(
    key,
    promise
  );

  return promise;
}

// -------------------------------------
// TOKEN METADATA
// -------------------------------------

export async function fetchTokenMetadataBatch(
  provider,
  ERC20_ABI,
  chainKey,
  tokens = []
) {
  try {
    if (!tokens.length) {
      return {};
    }
    
    const iface = new ethers.Interface(ERC20_ABI);

    const unique = [
      ...new Set(tokens.map((t) => t.toLowerCase())),
    ];

    const map = {};
    const toFetch = [];

    for (const token of unique) {
      const cacheKey = `${chainKey}:${token}`;

      // Retrieve cache
      const cached = getCache(
        "TokenMetadata",
        TOKEN_METADATA_CACHE,
        cacheKey,
        METADATA_TTL
      );

      if (cached !== null) {
      debug("tokenMetadata", "[TOKEN METADATA CACHE HIT]");
      map[token] = cached;
      } else {
        toFetch.push(token);
      }
    }

    if (!toFetch.length) {
      return map;
    }

    // Multicall
    const calls = [];

    toFetch.forEach(
      (token) => {
        calls.push({
          target: token,
          callData: iface.encodeFunctionData("symbol"),
        });

        calls.push({
          target: token,
          callData: iface.encodeFunctionData("decimals"),
        });

        calls.push({
          target: token,
          callData: iface.encodeFunctionData("name"),
        });
      }
    );

    const dedupKey = `metadata:${chainKey}:${[...toFetch]
      .sort()
      .join(",")}`;

    const results = await fetchWithDedup(
      dedupKey,
      () => executeMulticall(provider, calls)
    );

    let i = 0;

    toFetch.forEach(
      (token) => {
        const key = token.toLowerCase();

        const symbol = safeDecode(
          iface,
          "symbol",
          results[i++]
        );

        const decimals = safeDecode(
          iface,
          "decimals",
          results[i++]
        );

        const name = safeDecode(
          iface,
          "name",
          results[i++]
        );

        let data;

        if (!symbol || typeof symbol !== "string" || symbol.length > 50) {
          data = {
            symbol: "UNK",
            decimals: 18,
            name: "Unknown Token",
            isValid: false,
          };

        } else {
          data = {
            symbol,
            decimals: Number(decimals ?? 18),
            name: name || "Unknown Token",
            isValid: true,
          };
        }

        map[key] = data;

        // Save cache
        setCache(
          TOKEN_METADATA_CACHE,
          `${chainKey}:${key}`,
          data
        );
 
        debug("tokenMetadata", "[TOKEN METADATA NETWORK]");
      }
    );

    return map;

  } catch (err) {
    console.error(
      `[TOKEN METADATA][${chainKey}]`,
      err
    );
    return {};
  }
}

// -------------------------------------
//  TOKEN PRICES
// -------------------------------------

export async function fetchTokenPrices(
  chainKey,
  tokens = []
) {
  try {
    const addresses = tokens.map((t) => t.toLowerCase()).filter(Boolean);
    
    const native = getChain(chainKey).native;

    const map = {};

    if (native?.priceKey) {
      // Retrieve cache
      const cachedNative = getCache(
        "TokenPrice",
        TOKEN_PRICE_CACHE,
        native.priceKey,
        PRICE_TTL
      );

      if (cachedNative != null) {
        map[native.priceKey] = cachedNative;
      }
    }

    if (native?.address) {
      addresses.push(native.address.toLowerCase());
    }

    if (!addresses.length) {
      return {};
    }

   const network = native?.network;

    if (!network) {
      return {};
    }

    const url = `https://api.g.alchemy.com/prices/v1/${ALCHEMY_KEY}/tokens/by-address`;

    const toFetch = [];

    for (const addr of addresses) {
      // Retrieve cache
      const cached = getCache(
        "TokenPrice",
        TOKEN_PRICE_CACHE,
        addr,
        PRICE_TTL
      );

      if (cached !== null) {
        debug("tokenPrice", "[TOKEN PRICE CACHE HIT]");
        map[addr] = cached;
      } else {
        toFetch.push(addr);
      }
    }

    const CHUNK = 25;

    for (let i = 0; i < toFetch.length; i += CHUNK) {
      const chunk = toFetch.slice(i, i + CHUNK);

      await fetchWithDedup(
        `alchemy:${network}:${chunk.join(",")}`,
        async () => {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              addresses: chunk.map(
                (a) => ({
                  network,
                  address: a,
                })
              ),
            }),
          });

          if (!res.ok) {
            return;
          }

          const json = await res.json();

          for (const item of json?.data || []) {
            const addr = item.address?.toLowerCase();

            const price = Number(item ?.prices?.[0] ?.value || 0);

            if (addr && price > 0) {
              // Native price
              if (native && addr === native.address.toLowerCase()) {
                map[native.priceKey] = price;

                // Save cache
                setCache(
                  TOKEN_PRICE_CACHE,
                  native.priceKey,
                  price
                );
              }
 
              // Token price
              map[addr] = price;

              // Save cache
              setCache(
                TOKEN_PRICE_CACHE,
                addr,
                price
              );
 
              debug("tokenPrice", "[TOKEN PRICE NETWORK]");
            }
          }
        }
      );
    }

    return map;

  } catch (err) {
    console.error(
      `[TOKEN PRICES][${chainKey}]`,
      err
    );
    return {};
  }
}

// -------------------------------------
// ERC20 BALANCES
// -------------------------------------

export async function fetchTokenBalances(
  address,
  chainKey,
  tokens = []
) {
  try {
    if (!tokens.length) {
      return {};
    }
    
    const normalized = address.toLowerCase();
    const cacheKey = `${chainKey}:${normalized}`;

    // Retrieve cache
    const cached = getCache(
      "TokenBalance",
      TOKEN_BALANCE_CACHE,
      cacheKey,
      BALANCE_TTL
    );

    if (cached !== null) {
      debug("tokenBalance", "[TOKEN BALANCE CACHE HIT]");
      return cached;
    }

    const url = getChain(chainKey).rpc;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
          jsonrpc: "2.0",
          method: "alchemy_getTokenBalances",
          params: [
            normalized,
            tokens,
          ],
          id: 1,
        }),
      });

    const json = await res.json();
    
    const balances = {};

    for (const t of json.result.tokenBalances || []) {
      if (!t.tokenBalance) {
        continue;
      }

      balances[t.contractAddress.toLowerCase()] = t.tokenBalance;
    }

    // Save cache
    setCache(
      TOKEN_BALANCE_CACHE,
      cacheKey,
      balances
    );

    debug("tokenBalance", "[TOKEN BALANCE NETWORK]");

    return balances;

  } catch (err) {
    console.error(
      `[TOKEN BALANCES][${chainKey}]`,
      err
    );
    return {};
  }
}

// -------------------------------------
// NFT COLLECTIONS
// -------------------------------------

export async function fetchNFTCollectionBatch(
  chainKey,
  contracts = []
) {
  try {
    if (!contracts.length) {
      return {};
    }

    const normalizedContracts = [
      ...new Set(contracts.map((x) => x.toLowerCase())),
    ];

    const map = {};
    const toFetch = [];

    for (const contract of normalizedContracts) {
      const cacheKey = `${chainKey}:${contract}`;

      // Retrieve cache
      const cached = getCache(
        "NFTCollection",
        NFT_COLLECTION_CACHE,
        cacheKey,
        METADATA_TTL
      );

      if (cached !== null) {
        debug("nftCollection", "[NFT COLLECTION CACHE HIT]");
        map[contract] = cached;
      } else {
        toFetch.push(contract);
      }
    }

    if (!toFetch.length) {
      return map;
    }

    const base = getChain(chainKey).nft;

    if (!base) {
      return map;
    }

    const res = await fetch(
      `${base}/getContractMetadataBatch`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
            contractAddresses: toFetch,
          }),
      }
    );

    const json = await res.json();

    for (const c of json?.contracts || []) {
      const key = c.address.toLowerCase();

      const data = {
        name: c.name,
        symbol: c.symbol || "NFT",
        logo: c.openSeaMetadata ?.imageUrl || null,
        floorPrice: c.openSeaMetadata ?.floorPrice || 0,
      };

      map[key] = data;

      // Save cache
      setCache(
        NFT_COLLECTION_CACHE,
        `${chainKey}:${key}`,
        data
      );

      debug("nftCollection", "[NFT COLLECTION NETWORK]");
    }

    return map;

  } catch (err) {
    console.error(
      `[NFT COLLECTIONS][${chainKey}]`,
      err
    );
    return {};
  }
}

// -------------------------------------
// NFT BALANCES
// -------------------------------------

export async function fetchNFTBalances(
  address,
  chainKey,
  contracts = []
) {
  try {
    if (!contracts.length) {
      return {};
    }

    const normalized = address.toLowerCase();

    const normalizedContracts = contracts.map((x) => x.toLowerCase());

    const cacheKey = `${chainKey}:${normalized}:${normalizedContracts.sort().join(",")}`;

    // Retrieve cache
    const cached = getCache(
      "NFTBalance",
      NFT_BALANCE_CACHE,
      cacheKey,
      BALANCE_TTL
    );

    if (cached !== null) {
      debug("nftBalance", "[NFT BALANCE CACHE HIT]");
      return cached;
    }

    const base = getChain(chainKey).nft;

    if (!base) {
      return {};
    }

    let pageKey = null;

    const map = {};

    do {
      const params = new URLSearchParams({
        owner: normalized,
        withMetadata: "false",
        pageSize: "100",
      });

      // Server-side Filter
      for (const contract of normalizedContracts) {
        params.append("contractAddresses[]", contract);
      }

      if (pageKey) {
        params.append("pageKey", pageKey);
      }

      const url = `${base}/getNFTsForOwner?${params.toString()}`;

      const res = await fetch(url);

      if (!res.ok) {
        return {};
      }

      const json = await res.json();

      for (const nft of json.ownedNfts || []) {
        const contract = (nft.contractAddress || nft.contract?.address)?.toLowerCase();

        if (!contract) {
          continue;
        }

        // Erc1155 aware
        const qty = Number(nft.balance || 1);

        // Collection count
        map[contract] = (map[contract] || 0) + qty;

        // Token ownership
        const tokenId = nft?.tokenId || nft?.id?.tokenId;

        if (tokenId != null) {
          const normalizedTokenId = String(BigInt(tokenId));
          map[`${contract}:${normalizedTokenId}`] = true;
        }
      }

      pageKey = json.pageKey || null;

    } while (pageKey);

    // Save cache
    setCache(
      NFT_BALANCE_CACHE,
      cacheKey,
      map
    );

    debug("nftBalance", "[NFT BALANCE NETWORK]");

    return map;

  } catch (err) {
    console.error(
      `[NFT BALANCES][${chainKey}]`,
      err
    );
    return {};
  }
}