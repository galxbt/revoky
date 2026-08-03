// frontend/src/utils/helpers.js

// -------------------------------------
// APPROVAL KEY
// -------------------------------------

export function getApprovalKey(a) {
  const token = a.assetAddress?.toLowerCase();
  const spender = a.spender?.toLowerCase();

  if (a.assetType === "nft" && a.tokenId != null) {
    return `${token}-${spender}-${a.tokenId}`;
  }

  return `${token}-${spender}`;
}

// -------------------------------------
// GENERIC EXPLORER URL
// -------------------------------------

export function getExplorerUrl({
  type, // "token" | "address" | "tx"
  value,
  chain,
  selectedChain,
  CHAIN_EXPLORERS,
}) {
  if (!value) return null;

  const base = selectedChain === "all"
    ? "https://blockscan.com"
    : CHAIN_EXPLORERS[chain];

  return `${base}/${type}/${value}`;
}

// -------------------------------------
// UI HELPERS
// -------------------------------------

export function getRiskColor(risk) {
  switch (risk) {
    case "High":
      return "#ef4444";
    case "Medium":
      return "#f59e0b";
    case "Low":
      return "#22c55e";
    default:
      return "#94a3b8";
  }
}

export function truncateText(text, max = 18) {
  if (!text) return "";

  return text.length > max 
    ? text.slice(0, max) + "…" 
    : text;
}

export function truncateAddress(address, chars = 6) {
  if (!address) return "";

  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}