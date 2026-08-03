// backend/services/analyze.js

import { ethers } from "ethers";
import { debug } from "../utils/logger.js";
import { fetchContractNameBackend } from "./etherscan.js"; 
import { ADDRESS_ANALYSIS_CACHE } from "./caches.js";
import { getCache, setCache } from "../utils/cache.js";
import { CACHE_CONFIG } from "../config/cache.js";

const { METADATA_TTL } = CACHE_CONFIG;

// -------------------------------------
// PROXY SLOTS
// -------------------------------------

const IMPLEMENTATION_SLOT = "0x360894A13BA1A3210667C828492DB98DCA3E2076CC3735A920A3CA505D382BBC";
const ADMIN_SLOT = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
const BEACON_SLOT = "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50";

// -------------------------------------
// HELPERS
// -------------------------------------

function isZeroStorage(value) {
  return (
    !value ||
    value === "0x" ||
    value === "0x0000000000000000000000000000000000000000000000000000000000000000"
  );
}

function parseAddressFromStorage(storage) {
  try {
    return ethers.getAddress(
      "0x" + storage.slice(-40)
    );
  } catch {
    return null;
  }
}

// -------------------------------------
// EXECUTOR LABEL
// -------------------------------------

function resolveExecutorLabel(
  delegateAddress,
  etherscanLabel
) {
  if (!delegateAddress) {
    return null;
  }

  if (etherscanLabel) {
    return {
      label: `${etherscanLabel} (EIP-7702)`,
      source: "etherscan",
    };
  }

  return {
    label: `${delegateAddress.slice(0, 6)}...${delegateAddress.slice(-4)} (EIP-7702)`,
    source: "fallback",
  };
}

async function analyzeEOA({
  code,
  byteLength,
}) {
  debug("addressAnalysis", "[ADDRESS ANALYSIS NETWORK]");

  return {
    addressType: "EOA",
    type: "EOA",
    subType: "Standard",
    explanation: "Externally owned account.",
    isContract: false,
    isSmartWallet: false,
    isProxy: false,
    proxyType: null,
    proxyConfidence: "None",
    isClone: false,
    cloneType: null,
    isAA: false,
    isDelegated: false,
    implementationAddress: null,
    cloneImplementation: null,
    adminAddress: null,
    beaconAddress: null,
    byteLength,
    code,
  };
}

async function analyzeDelegatedEOA({
  code,
  byteLength,
  provider,
}) {
  const normalizedCode = code.toLowerCase();

  let delegateAddress = null;

  // -------------------------------------
  // EIP-7702 PARSE
  // -------------------------------------
  
  try {
    const hex = normalizedCode.replace(/^0x/, "");
    const raw = hex.slice(6, 46);
    delegateAddress = ethers.getAddress("0x" + raw);
  } catch {
    // Ignore
  }

  let etherscanLabel = null;
  let chainId = null;

  try {
    const net = await provider.getNetwork();
    chainId = Number(net.chainId);
  } catch {
    // Ignore
  }

  if (delegateAddress && chainId) {
    etherscanLabel = await fetchContractNameBackend(
      delegateAddress,
      chainId
    );
  }

  const executor = resolveExecutorLabel(
    delegateAddress,
    etherscanLabel
  );

  debug("addressAnalysis", "[ADDRESS ANALYSIS NETWORK]");

  return {
    addressType: "EOA",
    type: "Delegated EOA",
    subType: "EIP-7702",
    explanation: "EOA with execution delegated via EIP-7702.",
    isContract: false,
    isSmartWallet: false,
    isProxy: false,
    proxyType: null,
    proxyConfidence: "None",
    isClone: false,
    cloneType: null,
    isAA: false,
    isDelegated: true,
    delegateAddress,
    executorLabel: executor?.label || null,
    executorMeta: executor,
    implementationAddress: null,
    cloneImplementation: null,
    adminAddress: null,
    beaconAddress: null,
    byteLength,
    code,
  };
}

async function analyzeContract({
  address,
  code,
  byteLength,
  storage,
}) {
  const lower = address.toLowerCase();
  
  const normalizedCode = code.toLowerCase();
  
  const isContract = true;
  
  const isDelegated =
    normalizedCode.includes("execute") &&
    normalizedCode.includes("delegate");
  
  const isSafeLike =
    normalizedCode.includes("getowners") ||
    normalizedCode.includes("getthreshold") ||
    normalizedCode.includes("exectransaction");
  
  const has4337 =
    normalizedCode.includes("entrypoint") ||
    normalizedCode.includes("validateuserop");
  
  const isAA = has4337;
  
  const isLikelyAA =
    byteLength > 2000 &&
    has4337;

  // -------------------------------------
  // PROXY DETECTION
  // -------------------------------------
  
  let implementationAddress = null;
  let adminAddress = null;
  let beaconAddress = null;
  let proxyType = null;
  let proxyConfidence = "None";

  // -------------------------------------
  // CLONE DETECTION
  // -------------------------------------
  
  let isClone = false;
  let cloneType = null;
  let cloneImplementation = null;
  
  // -------------------------------------
  // EIP-1967 IMPLEMENTATION
  // -------------------------------------
  
  if (!isZeroStorage(storage?.implementation)) {
    implementationAddress = parseAddressFromStorage(
      storage.implementation
    );
  
    if (implementationAddress?.toLowerCase() === lower) {
      implementationAddress = null;
    }
  }
  
  // -------------------------------------
  // EIP-1967 ADMIN
  // -------------------------------------
  
  if (!isZeroStorage(storage?.admin)) {
    adminAddress = parseAddressFromStorage(
      storage.admin
    );
  
    if (adminAddress?.toLowerCase() === lower) {
      adminAddress = null;
    }
  }
  
  // -------------------------------------
  // EIP-1967 BEACON
  // -------------------------------------
  
  if (!isZeroStorage(storage?.beacon)) {
    beaconAddress = parseAddressFromStorage(
      storage.beacon
    );
  
    if (beaconAddress?.toLowerCase() === lower) {
      beaconAddress = null;
    }
  }

  // -------------------------------------
  // EIP-1167 MINIMAL PROXY
  // -------------------------------------
  
  const is1167 =
    normalizedCode.startsWith("0x363d3d373d3d3d363d73") &&
    normalizedCode.endsWith("5af43d82803e903d91602b57fd5bf3");

  if (isContract && is1167) {
    try {
      const start = "0x363d3d373d3d3d363d73".length;

      const raw = "0x" + normalizedCode.slice(start, start + 40);

      cloneImplementation = ethers.getAddress(raw);

      if (cloneImplementation.toLowerCase() !== lower) {
        isClone = true;
        cloneType = "EIP-1167";
      }

    } catch {
      // Ignore
    }
  }

  // -------------------------------------
  // PROXY CLASSIFICATION
  // -------------------------------------

  if (isContract && implementationAddress) {
    proxyType = "EIP-1967";
    proxyConfidence = "High";
  }

  else if (isContract && beaconAddress) {
    proxyType = "Beacon";
    proxyConfidence = "High";
  }

  const isProxy = !!proxyType;

  // -------------------------------------
  // SMART WALLET
  // -------------------------------------
  
  const isSmartWallet =
    isAA || 
    isDelegated || 
    isSafeLike || 
    isLikelyAA ||
    ((isProxy || isClone) && has4337);

  // -------------------------------------
  // CLASSIFICATION
  // -------------------------------------
  
  let classification;

  if (isSmartWallet) {
    classification = {
      type: "Smart Wallet",

      subType:
        isDelegated ? "Delegated"
        : isAA || isLikelyAA ? "ERC-4337"
        : "Multisig",

      explanation: "Smart account with advanced execution.",
    };
  }

  else if (isProxy && isContract) {
    classification = {
      type: "Contract",

      subType: proxyType,

      explanation:
        proxyType === "Beacon"
          ? "Upgradeable beacon proxy."
          : "Upgradeable proxy (EIP-1967).",
    };
  }

  else if (isClone && isContract) {
    classification = {
      type: "Contract",

      subType: "Minimal Proxy",

      explanation: "Minimal clone proxy (EIP-1167).",
    };
  }

  else if (isContract) {
    classification = {
      type: "Contract",

      subType: "Standard",

      explanation: "Deployed contract.",
    };
  }

  // -------------------------------------
  // RESULT
  // -------------------------------------
  
  const result = {
    addressType: classification.type,
    isContract,
    isSmartWallet,
    isProxy,
    proxyType,
    proxyConfidence,
    isClone,
    cloneType,
    isAA,
    isDelegated,
    implementationAddress,
    cloneImplementation,
    adminAddress,
    beaconAddress,
    byteLength,
    code,
    ...classification,
  };

  debug("addressAnalysis", "[ADDRESS ANALYSIS NETWORK]");

  return result;
}

export async function analyzeAddress({
  address,
  provider,
  codeMap,
  storageMap,
}) {
  const lower = address.toLowerCase();

  let code = codeMap[lower];

  const normalizedCode = code.toLowerCase();
  const byteLength = normalizedCode.length;

  if (normalizedCode === "0x") {
    return analyzeEOA({
      code,
      byteLength,
    });
  }

  if (normalizedCode.startsWith("0xef0100")) {
    return analyzeDelegatedEOA({
      code,
      byteLength,
      provider,
    });
  }

  return analyzeContract({
    address,
    code,
    byteLength,
    storage: storageMap?.[lower],
  });
}

export async function analyzeAddresses({
  addresses,
  chainKey,
  provider,
}) {
  const unique = [...new Set(
    addresses.map((a) => a.toLowerCase())
  )];

  const codeMap = {};
  const storageMap = {};
  const analysisMap = {};

  const uncached = [];
  
  for (const addr of unique) {
    const cacheKey = `${chainKey}:${addr}`;
  
    const cached = getCache(
      "AddressAnalysis",
      ADDRESS_ANALYSIS_CACHE,
      cacheKey,
      METADATA_TTL
    );
  
    if (cached !== null) {
      debug(
        "addressAnalysis",
        "[ADDRESS ANALYSIS CACHE HIT]"
      );
  
      analysisMap[addr] = cached;
    } else {
      uncached.push(addr);
    }
  }

  if (uncached.length === 0) {
    return analysisMap;
  }

  // -----------------------------
  // BYTECODE
  // -----------------------------
  
  await Promise.all(
    uncached.map(async (addr) => {
      try {
        codeMap[addr] = await provider.getCode(addr);
      } catch {
        codeMap[addr] = "0x";
      }
    })
  );

  // -----------------------------
  // STORAGE
  // -----------------------------
  
  const contracts = [];
  
  for (const addr of uncached) {
    const code = (codeMap[addr] || "0x").toLowerCase();
  
    if (
      code !== "0x" &&
      !code.startsWith("0xef0100")
    ) {
      contracts.push(addr);
    }
  }  
  
  await Promise.all(
    contracts.map(async (addr) => {
      const [
        implementation,
        admin,
        beacon,
      ] = await Promise.allSettled([
        provider.getStorage(addr, IMPLEMENTATION_SLOT),
        provider.getStorage(addr, ADMIN_SLOT),
        provider.getStorage(addr, BEACON_SLOT),
      ]);

      storageMap[addr] = {
        implementation:
          implementation.status === "fulfilled"
            ? implementation.value
            : null,

        admin:
          admin.status === "fulfilled"
            ? admin.value
            : null,

        beacon:
          beacon.status === "fulfilled"
            ? beacon.value
            : null,
      };
    })
  );

  // -----------------------------
  // ANALYZE
  // -----------------------------
  
  await Promise.all(
    uncached.map(async (addr) => {
      try {
        const result = await analyzeAddress({
          address: addr,
          provider,
          codeMap,
          storageMap,
        });
  
        analysisMap[addr] = result;
  
        setCache(
          ADDRESS_ANALYSIS_CACHE,
          `${chainKey}:${addr}`,
          result
        );
  
      } catch {
        analysisMap[addr] = null;
      }
    })
  );  

  return analysisMap;
}