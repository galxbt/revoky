// frontend/src/hooks/useScanHandler.js

import { ethers } from "ethers";
import { getCache } from "../utils/cache";
import { getAccountInfo } from "../utils/wallet";

import {
  getSession,
  getSessionKey,
  getSessionScan,
  setActiveSession,
} from "../utils/session";

export function useScanHandler({
  state,
  setters,
  refs,
  constants,
  derived,
}) {
  const {
    selectedChain,
    scanAddress,
    connectedAddress,
    hasScanned,
  } = state;
  
  const {
    setScanAddress,
    setScannedAddress,
    setLastScannedInput,
    setApprovals,
    setBackendData,
    setAccountInfo,
    setSelected,    
    setHasScanned,
    setError,
    setLoadingTarget,
    setIsValidScan,
    setDisplayName,
    setLoading,
    setIsEnriched,
    setLastUpdated,
    setIsRefreshing,
    setCacheHitFeedback,
    setSelectedChain,
    setShowChainDropdown,
  } = setters;

  const {
    scanCacheRef,
    lastBgRefreshRef,
    lastManualScanRef,
    requestIdRef,
  } = refs;

  const {
    DISABLE_CACHE,
    CACHE_TTL,
    REFRESH_THRESHOLD,
    BG_REFRESH_INTERVAL,
    MANUAL_REFRESH_INTERVAL,
  } = constants;
  
  const {
    fetchApprovalsForAddress,
  } = derived;

  // -------------------------------------
  // RESOLVE ADDRESS / ENS
  // -------------------------------------
  
  async function resolveAddress(
    input,
    chainKey,
  ) {
    const value = input.trim();
  
    // Direct address
    if (ethers.isAddress(value)) {
      const resolvedAddress = ethers.getAddress(value);
  
      return {
        resolvedAddress,
        normalized:
          resolvedAddress.toLowerCase(),
      };
    }
  
    // ENS
    if (value.endsWith(".eth")) {
      const API_URL =
        import.meta.env.VITE_API_URL ||
        `http://${window.location.hostname}:3000`;

      try {
        const res = await fetch(
          `${API_URL}/resolve?name=${value}&chain=${chainKey}`
        );
  
        if (!res.ok) {
          throw new Error("Unable to resolve ENS. Please try again.");
        }
  
        const json = await res.json();
  
        if (!json?.address) {
          throw new Error("ENS name not found");
        }
  
        const resolvedAddress = ethers.getAddress(json.address);
  
        return {
          resolvedAddress,
          normalized:
            resolvedAddress.toLowerCase(),
        };
  
      } catch (err) {
        console.error("ENS resolution failed:", err);
  
        throw new Error(err.message || "Unable to resolve ENS. Please try again.");
      }
    }
  
    throw new Error("Invalid wallet address");
  }

  // -------------------------------------
  // RESTORE CACHED SCAN
  // -------------------------------------
 
  function restoreCachedScan(
    cached,
    chainKey,
    address,
  ) {
    setScannedAddress(address);

    setApprovals(cached.data.approvals || []);

    setBackendData({
      ...(cached.data.analysis || {}),
      walletRisk: cached.data.walletRisk,
    });

    setAccountInfo(
      getAccountInfo(
        cached.data.analysis,
        chainKey,
        address,
      )
    );

    setLastUpdated(cached.timestamp);

    setHasScanned(true);
    setIsEnriched(true);
    setIsRefreshing(false);

    setActiveSession({
      chainKey,
      scannedAddress: address,
    });
  }

  // -------------------------------------
  // MANUAL SCAN
  // -------------------------------------
 
  async function handleScan(address) {
    const input = address.trim();

    // Ignore empty scan input
    if (!input) {
      setIsValidScan(false);
      return;
    }

    requestIdRef.current++;
 
    setError(null);
    setDisplayName(null);

    let normalized;

    // Resolve and validate the scan address
    try {
      ({
        normalized,
      } = await resolveAddress(
        input,
        selectedChain,
      ));
  
      setIsValidScan(true);

    } catch (err) {
      setError(err.message);
      setIsValidScan(false);
      return;
    }

    setLoadingTarget("result");

    const cacheKey = getSessionKey(
      selectedChain,
      normalized,
    );

    // Retrieve cache
    const cached = DISABLE_CACHE ? null : getCache(
      scanCacheRef,
      cacheKey,
      DISABLE_CACHE,
      CACHE_TTL,
    );

    const now = Date.now();

    const lastManual = lastManualScanRef.current[cacheKey] || 0;

    // Throttle
    if ( 
      !DISABLE_CACHE && cached !== null && 
      now - lastManual < MANUAL_REFRESH_INTERVAL 
    ) {
      if (cached?.data) {
        setCacheHitFeedback(true);

        setTimeout(() => {
          setCacheHitFeedback(false);
        }, 1200);
  
        restoreCachedScan(
          cached,
          selectedChain,
          normalized,
        );   

        setLoading(false);
        setLoadingTarget(null);
      }
  
      return;
    }

    setLoading(true);

    if (cached === null) {
      setBackendData({});
      setAccountInfo(null);
      setLastUpdated(null);
      setIsEnriched(false);
    }

    if (cached !== null) {
      const age = now - cached.timestamp;

      restoreCachedScan(
        cached,
        selectedChain,
        normalized,
      );

      // Manual refresh
      if (now - lastManual >= MANUAL_REFRESH_INTERVAL) {
        setLoadingTarget("result");
 
        setIsRefreshing(true);

        lastManualScanRef.current[cacheKey] = now;

        sessionStorage.setItem(
          "revoky-last-manual-scan",
          JSON.stringify(lastManualScanRef.current)
        );

        fetchApprovalsForAddress(  
          normalized,  
          selectedChain,  
          true,  
          input,  
        );  

        return;
      }

      // Background refresh 
      const lastBg = lastBgRefreshRef.current[cacheKey] || 0;

      const shouldRefresh = 
        age > CACHE_TTL * REFRESH_THRESHOLD &&
        now - lastBg > BG_REFRESH_INTERVAL;

      if (shouldRefresh) {
        setIsRefreshing(true);

        lastBgRefreshRef.current[cacheKey] = now;

        fetchApprovalsForAddress(  
          normalized,  
          selectedChain,  
          false,  
          input,  
        );  
      }

      setLoading(false);

      return;
    }

    // Fresh fetch
    lastManualScanRef.current[cacheKey] = now;

    sessionStorage.setItem(
      "revoky-last-manual-scan",
      JSON.stringify(lastManualScanRef.current)
    );

    setScannedAddress(normalized);
  
    setApprovals([]);
    setSelected({});
    setLoading(true);
    setIsEnriched(false);
  
    fetchApprovalsForAddress(  
      normalized,  
      selectedChain,  
      true,  
      input,  
    );  
  }
  
  // -------------------------------------
  // CHAIN SWITCH
  // -------------------------------------
  
  async function handleChainChange(chainKey) {
    setShowChainDropdown(false);
    setError(null);
 
    // Ignore if the selected chain is unchanged 
    if (chainKey === selectedChain) {
      return;
    }
  
    // Block chain switching on result page with cleared input 
    if (hasScanned && !scanAddress.trim()) {
      return;
    }
  
    const wasDisconnected = sessionStorage.getItem(
      "revoky-wallet-disconnected",
    ) === "true";
  
    const addressToScan = scanAddress || (!wasDisconnected ? connectedAddress : null);
  
    // Switch chain without scanning if no active scan yet
    if (!addressToScan) {
      setSelectedChain(chainKey);
      return;
    }
  
    const input = addressToScan.trim();
  
    let normalized;

    // Resolve and validate the scan address
    try {
      ({
        normalized,
      } = await resolveAddress(
        input,
        chainKey,
      ));
  
      setIsValidScan(true);
  
    } catch (err) {
      setError(err.message);
      setIsValidScan(false);
      return;
    }

    // Restore any saved session state before switching chains
    const session = getSession();
  
    const chainSession = getSessionScan(
      session,
      chainKey,
      normalized,
    );
  
    if (chainSession) {
      setScanAddress(chainSession.scanAddress);
  
      setLastScannedInput(chainSession.lastScannedInput);
  
      setScannedAddress(chainSession.scannedAddress);
    }
  
    setSelectedChain(chainKey);

    const cacheKey = getSessionKey(
      chainKey,
      normalized,
    );
  
    // Retrieve cache
    const cached = DISABLE_CACHE ? null : getCache(
      scanCacheRef,
      cacheKey,
      DISABLE_CACHE,
      CACHE_TTL,
    );
  
    if (cached !== null) {
      restoreCachedScan(
        cached,
        chainKey,
        normalized,
      );
  
      setLoading(false);
      setLoadingTarget(null);
      setDisplayName(null);
  
      return;
    }
  
    setLoadingTarget("result");
  
    setApprovals([]);
    setBackendData({});
    setSelected({});
    setAccountInfo(null);
    setLoading(true);
    setIsEnriched(false);
    setLastUpdated(null);
    setIsRefreshing(false);
    setDisplayName(null);
  
    await fetchApprovalsForAddress(
      normalized,
      chainKey,
      false,
      input,
    );
  }

  return {
    handleScan,
    handleChainChange,
  };
}