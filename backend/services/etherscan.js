// backend/services/etherscan.js

import { debug } from "../utils/logger.js";
import { getCache, setCache } from "../utils/cache.js";
import { CONTRACT_NAME_CACHE } from "./caches.js";

const ETHERSCAN_KEY = process.env.ETHERSCAN_API_KEY;

export async function fetchContractNameBackend(
  address,
  chainId
) {
  const normalized = address.toLowerCase();
  const key = `${chainId}:${normalized}`;

  // Retrieve cache
  const cached = getCache(
    "ContractName",
    CONTRACT_NAME_CACHE,
    key
  );

  if (cached !== null) {
    debug("contractName", "[CONTRACT NAME CACHE HIT]");
    return cached;
  }

  try {
    const url = `https://api.etherscan.io/v2/api?module=contract&action=getsourcecode&address=${address}&chainid=${chainId}&apikey=${ETHERSCAN_KEY}`;

    const res = await fetch(url);
    const json = await res.json();

    const name =
      json?.result?.[0]?.ContractName || null;

    // Save cache
    setCache(
      CONTRACT_NAME_CACHE,
      key,
      name
    );

    debug("contractName", "[CONTRACT NAME NETWORK]");

    return name;
  } catch {
    return null;
  }
}