// frontend/src/utils/wallet.js

// -------------------------------------
// NORMALIZE ADDRESS
// -------------------------------------

function normalize(addr) {
  return typeof addr === "string" ? addr.toLowerCase() : null;
}

// -------------------------------------
// GET ANALYSIS FOR ANY ADDRESS
// -------------------------------------

export function getAddressAnalysis(
  backendData, 
  address,
) {
  if (!backendData || !address) return null;

  const lower = normalize(address);
 
  if (!lower) return null;

  // Wallet
  if (backendData.address && normalize(backendData.address) === lower) {
    return backendData.addressAnalysis || null;
  }

  // Spenders
  if (backendData.spenderAnalysisMap) {
    return backendData.spenderAnalysisMap[lower] || null;
  }

  return null;
}

// -------------------------------------
// FULL ADDRESS METADATA
// -------------------------------------

export function getAddressMeta(
  backendData, 
  address,
) {
  const meta = getAddressAnalysis(
    backendData, 
    address,
  );

  return {
    addressType: "Unknown",
    type: "Unknown",
    subType: null,
    explanation: null,
    ensName: null,
    isContract: false,
    isSmartWallet: false,
    isProxy: false,
    isAA: false,
    isDelegated: false,
    executorLabel: null,
    implementationAddress: null,
    proxyConfidence: "None",
    delegateAddress: null,
    ...meta,
  };
}

// -------------------------------------
// RESOLVE ACCOUNT INFO
// -------------------------------------

export function getAccountInfo(
  analysis,
  chainKey,
  address,
) {
  if (chainKey === "all") {
    return {
      type: "Mixed",
      subType: "Chain-dependent",
      explanation:
        "Account type may vary across different blockchain networks.",
    };
  }

  if (!analysis) {
    return null;
  }

  const chainData = analysis?.[chainKey];

  const meta = getAddressMeta(
    chainData, 
    address,
  );

  return (
    meta?.addressType !== "Unknown"
      ? meta
      : null
  );
}