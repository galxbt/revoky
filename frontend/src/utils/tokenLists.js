// frontend/src/utils/tokenLists.js

import { CHAINS } from "../config/chains";

// -------------------------------------
// CHAIN LOOKUP
// -------------------------------------

function getChainKey(chainId) {
  return Object.keys(CHAINS).find(
    (key) => CHAINS[key].chainId === chainId
  );
}

// -------------------------------------
// TOKEN MAP
// -------------------------------------

let TOKEN_MAP = null;

// -------------------------------------
// TOKEN LISTS
// -------------------------------------

export async function loadTokenList() {
  if (TOKEN_MAP) return TOKEN_MAP;

  const map = {};

  try {
    const sources = [
      // Uniswap
      fetch("https://tokens.uniswap.org").then(r => r.json()),

      // 1inch
      fetch("https://tokens.1inch.io/v1.1/1").then(r => r.json()),
      fetch("https://tokens.1inch.io/v1.1/42161").then(r => r.json()),

      // Pancake
      fetch("https://tokens.pancakeswap.finance/pancakeswap-extended.json").then(r => r.json()),
      fetch("https://tokens.pancakeswap.finance/pancakeswap-base-default.json").then(r => r.json()),
    ];

    const results = await Promise.allSettled(sources);

    const [
      uniswapRes,
      inchEthRes,
      inchArbRes,
      pancakeExtendedRes,
      pancakeBaseRes
    ] = results;

    const safeJson = (res) =>
      res.status === "fulfilled" ? res.value : null;

    const uniswap = safeJson(uniswapRes);
    const inchEth = safeJson(inchEthRes);
    const inchArb = safeJson(inchArbRes);
    const pancakeExtended = safeJson(pancakeExtendedRes);
    const pancakeBase = safeJson(pancakeBaseRes);

    // Uniswap
    for (const token of uniswap?.tokens || []) {
      const chain = getChainKey(token.chainId);  

      if (!chain || !token.address) continue;

      const key = `${chain}:${token.address.toLowerCase()}`;

      map[key] = {
        symbol: token.symbol || "UNK",
        name: token.name || "Unknown Token",
        decimals: token.decimals ?? 18,
        logo: token.logoURI || null,
      };
    }

    // 1inch
    function process1inch(data, chainId) {
      if (!data) return;

      const chain = getChainKey(chainId);

      if (!chain) return;

      const tokens = data.tokens || data;

      for (const addr in tokens) {
        const token = tokens[addr];
 
        if (!addr) continue;

        const key = `${chain}:${addr.toLowerCase()}`;

        map[key] = {
          symbol: token.symbol || "UNK",
          name: token.name || "Unknown Token",
          decimals: token.decimals ?? 18,
          logo: token.logoURI || null,
        };
      }
    }

    process1inch(inchEth, 1);
    process1inch(inchArb, 42161);

    // Pancake
    function processList(list) {
      if (!list) return;

      for (const token of list.tokens || []) {
        const chain = getChainKey(token.chainId);

        if (!chain || !token.address) continue;

        const key = `${chain}:${token.address.toLowerCase()}`;

        map[key] = {
          symbol: token.symbol || "UNK",
          name: token.name || "Unknown Token",
          decimals: token.decimals ?? 18,
          logo: token.logoURI || null,
        };
      }
    }

    processList(pancakeExtended);
    processList(pancakeBase);

    TOKEN_MAP = map;
 
    return map;

  } catch (err) {
    console.warn(
      "⚠️ Token lists load failed", 
      err
    );
  
    TOKEN_MAP = {};

    return TOKEN_MAP;
  }
}