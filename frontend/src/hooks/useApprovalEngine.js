// frontend/src/hooks/useApprovalEngine.js

import { CHAINS } from "../config/chains";
import { getAccountInfo } from "../utils/wallet";
import { loadTokenList } from "../utils/tokenLists";
import { getTrustWalletLogo } from "../utils/tokenLogos";

import { 
  getCache, 
  setCache,
} from "../utils/cache";

import {
  getSessionKey,
  saveSessionScan,
  setActiveSession,
} from "../utils/session";

export function useApprovalEngine({
  state,
  setters,
  refs,
  constants,
  helpers,
}) {
  const {
    selectedChain,
  } = state;

  const {
    setApprovals,
    setBackendData,
    setAccountInfo,
    setLoading,
    setLoadingTarget,
    setError,
    setHasScanned,
    setIsEnriched,
    setScanFailed,
    setScannedAddress,
    setAddressMeta,
    setLastUpdated,
    setIsRefreshing,
  } = setters;

  const {
    scanCacheRef,
    requestIdRef,
  } = refs;

  const {
    DISABLE_CACHE,
    CACHE_TTL,
  } = constants;

  const {
    truncateAddress,
    saveRecentWallet,
  } = helpers;

  const tokenListRef = refs.tokenListRef ||
    (refs.tokenListRef = {
      current: null,
    });

  const ownerLabelCache = {};

  // -------------------------------------
  // FINAL ENRICHER
  // -------------------------------------
  
  async function enrichFinalItems(raw) {
    if (!tokenListRef.current) {
      tokenListRef.current = 
        await loadTokenList();
    }

    const tokenList = tokenListRef.current;

    return Promise.all(
      raw.map(async (item) => {
        const tokenKey = `${item.chain}:${item.assetAddress}`;
  
        const listMeta = tokenList[tokenKey];
  
        const isFromList = !!listMeta;
  
        const logo = item.assetLogo || listMeta?.logo || getTrustWalletLogo(item.chain, item.assetAddress);
  
        let ownerLabel = ownerLabelCache[item.spender];
  
        if (!ownerLabel) {
          ownerLabel = item.ownerLabel || truncateAddress(item.spender);
  
          ownerLabelCache[item.spender] = ownerLabel;
        }
  
        const rawAmount = item.rawAllowance;
  
        const balance = Number(item.balance || 0);
  
        const effectiveAmount = item.assetType === "nft" ? balance : Math.min(rawAmount, balance);
  
        const valueAtRisk = Number(item.valueUSD || 0);
  
        return {
          ...item,
          rawAmount,
          effectiveAmount,
          valueAtRisk,
          assetLogo: logo,
          isFromList,
          ownerLabel,
          isKnownProtocol: 
          !!item.isKnownProtocol,
        };
      })
    );
  }

  // -------------------------------------
  // MAIN FETCH
  // -------------------------------------
 
  async function fetchApprovalsForAddress(
    address,
    chainKey = selectedChain,
    bypassCache = false,
    originalInput = address,
  ) {
    if (!address) {
      return;
    }

    setError(null);
    setScanFailed(false);

    const normalized =  address.toLowerCase();

    const cacheKey = getSessionKey(
      chainKey,
      normalized,
    );

    // Retrieve cache
    const cached = bypassCache ? null : getCache(
      scanCacheRef,
      cacheKey,
      DISABLE_CACHE,
      CACHE_TTL
    );

    if (cached !== null) {
      setScannedAddress(address);

      setApprovals(cached.data.approvals);

      setBackendData({
        ...(cached.data.analysis || {}),
        walletRisk: cached.data.walletRisk,
      });

      setAccountInfo(
        getAccountInfo(
          cached.data.analysis,
          chainKey,
          normalized,
        )
      );

      setLastUpdated(cached.timestamp);

      setIsRefreshing(false);
      setIsEnriched(true);
      setHasScanned(true);
      setLoading(false);
      setLoadingTarget(null);

      return;
    }

    const started = performance.now();

    const fetchId = ++requestIdRef.current;

    setScannedAddress(address);

    setLoading(true);
    setError(null);

    const API_URL =
      import.meta.env.VITE_API_URL ||
      `http://${window.location.hostname}:3000`;
      
    try {
      // Fetch approvals
      const res1 = await fetch(
        `${API_URL}/approvals?address=${normalized}&chain=${chainKey}`
      );

      if (!res1.ok) {
        throw new Error("Approvals fetch failed");
      }

      const json1 = await res1.json();

      const approvals = json1.approvals || [];

      // Enrich approvals
      const res2 = await fetch(
        `${API_URL}/enrich`, 
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              address: normalized,
              chain: chainKey,
              approvals,
            }),
          }
      );

      if (!res2.ok) {
        throw new Error("Enrich failed");
      }

      const json2 = await res2.json();

      const ens = json2?.analysis?.[chainKey] ?.identity ?.ensName || null;
 
      saveRecentWallet({
        input: address,
        resolved: normalized,
        ens,
        chain: chainKey,
      });

      if (fetchId !== requestIdRef.current) {
        setScanFailed(false);
        return;
      }

      setBackendData({
        ...json2.analysis,
        walletRisk: json2.walletRisk,
      });

      setAccountInfo(
        getAccountInfo(
          json2.analysis,
          chainKey,
          normalized,
        )
      );

      const raw = json2.approvals || [];

      const final = await enrichFinalItems(
        raw,
        chainKey,
      );

      setApprovals(final);
      setLastUpdated(Date.now());
      setIsEnriched(true);

      saveSessionScan({
        chainKey,
        scanAddress: originalInput,
        scannedAddress: normalized,
        lastScannedInput: originalInput,
      });

      setActiveSession({
        chainKey,
        scannedAddress: normalized,
      });

      setHasScanned(true);
      setIsRefreshing(false);

      // Save cache
      setCache(
        scanCacheRef,
        cacheKey,
        {
          approvals: final,
          walletRisk: json2.walletRisk,
          analysis: json2.analysis,
        },
        DISABLE_CACHE
      );

    } catch (err) {
      console.error("❌ Scan failed:", err);

      setScanFailed(true);
      setError(err.message);
      setIsRefreshing(false);
  
    } finally {
      const seconds =
      (performance.now() - started) / 1000;

      console.log(
      `[TOTAL SCAN] ${seconds.toFixed(2)}s`
    );
      
      setLoading(false);
      setLoadingTarget(null);
    }
  }

  // -------------------------------------
  // ADDRESS META
  // -------------------------------------
  
  async function enrichAddresses(list) {
    const updated = {};

    await Promise.all(
      list.map(async (item) => {
        const addr = item.spender;

        if (!addr) {
          return;
        }

        const label = item.ownerLabel || truncateAddress(addr);

        updated[addr] = {
          ownerLabel:
            label || truncateAddress(addr),
          isKnownProtocol:
            !!item.isKnownProtocol,
        };
      })
    );

    setAddressMeta(
      (prev) => ({
        ...prev,
        ...updated,
      })
    );
  }

  return {
    fetchApprovalsForAddress,
    enrichAddresses,
  };
}