// frontend/src/utils/url.js

import { CHAINS } from "../config/chains";

// -------------------------------------
// FORMAT A CHAIN FOR URL ROUTING
// -------------------------------------

export function formatChainForUrl(chainKey) {
  if (chainKey === "all") return "all-chains";
  return chainKey;
}
 
// -------------------------------------
// PARSE A CHAIN FROM THE URL
// -------------------------------------

export function parseChainFromUrl(pathChain) {
  if (!pathChain) return null;
  
  if (pathChain.toLowerCase() === "all-chains") return "all";
  
  return Object.keys(CHAINS).find(
   key => key.toLowerCase() === pathChain.toLowerCase()
  );
}

// -------------------------------------
// UPDATE THE CURRENT URL
// -------------------------------------

export function updateUrl(
  address,
  chainKey,
  sortOption = "all",
  sortMetric = "value"
) {
  if (!address) return;

  const formattedChain = formatChainForUrl(chainKey);

  const view = sortOption;
  const metric = sortMetric;

  let path = `/${address}/${formattedChain}`;

  if (view !== "all" || metric !== "value") {
    path += `/${view}`;
  }

  if (metric !== "value") {
    path += `/${metric}`;
  }

  window.history.replaceState({}, "", path);
}