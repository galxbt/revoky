// frontend/src/hooks/useSessionManager.js

import { useEffect } from "react";
import { ethers } from "ethers";
import { getAccountInfo } from "../utils/wallet";
import { resetToFreshSession } from "../utils/resetSession";

import { 
  parseChainFromUrl, 
  updateUrl,
} from "../utils/url";

import { 
  clearCache, 
  getCache,
} from "../utils/cache";

import {
  getSession,
  getSessionKey,
  getSessionScan,
  getActiveSession,
} from "../utils/session";

export function useSessionManager({
  state,
  setters,
  refs,
  constants,
  helpers,
  config,
  derived,
}) {
  const {
    isHydrated,
    connectedAddress,
    walletActive,
    selectedChain,
    scanAddress,
    scannedAddress,
    lastScannedInput,
    sortOption,
    sortMetric,
    sortDirection,
    cardLayout,
    hasScanned,
    scanFailed,
    darkMode,
  } = state;

  const {
    setError,
    setScanFailed,
    setScanAddress,
    setScannedAddress,
    setLastScannedInput,
    setApprovals,
    setLoading,
    setLoadingTarget,
    setHasScanned,
    setBackendData,
    setAccountInfo,
    setLastUpdated,
    setIsRefreshing,
    setIsEnriched,
    setSelectedChain,
    setIsHydrated,
    setConnectedAddress,
    setWalletActive,
    setIsValidScan,
    setSortOption,
    setSortMetric,
    setSortDirection,
    setCardLayout,
    setRecentWallets,
    setScreen,
  } = setters;

  const {
    scanCacheRef,
    lastManualScanRef,
  } = refs;

  const {
    DISABLE_CACHE,
    CACHE_TTL,
  } = constants;

  const {
    CHAINS,
  } = config;

  const {
    getRecentWallets,
  } = helpers;
  
  const {
    fetchApprovalsForAddress,
  } = derived;

  // -------------------------------------
  // RESTORE CACHED STATE
  // -------------------------------------
  
  function restoreCachedState(
    cached,
    chainKey,
    address,
  ) {
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
    setLoading(false);
  }

  // -------------------------------------
  // RESTORE OR FETCH SCAN
  // -------------------------------------
 
  function restoreOrFetchScan({
    cached,
    chainKey,
    address,
    originalInput,
  }) {
    if (cached?.data) {
      restoreCachedState(
        cached,
        chainKey,
        address,
      );

      return;
    }

    setLoading(true);
    setLoadingTarget("result");
    setIsEnriched(false);
    setIsRefreshing(false);

    fetchApprovalsForAddress(
      address,
      chainKey,
      true,
      originalInput,
    );
  }
  
  // -------------------------------------
  // SESSION BOOTSTRAP
  // -------------------------------------
 
  useEffect(() => {
    async function bootstrapSession() {
      const session = getSession();

      setConnectedAddress(session.connectedAddress || null);

      setWalletActive(!!session.connectedAddress);

      const chainSession = getActiveSession(session) || {};

      // Validate any saved ENS name before restoring the session
      if (chainSession.scanAddress?.endsWith(".eth")) {
        const API_URL =
          import.meta.env.VITE_API_URL ||
          `http://${window.location.hostname}:3000`;

        try {
          const res = await fetch(
            `${API_URL}/resolve?name=${chainSession.scanAddress}&chain=${
              session.selectedChain || "ethereum"
            }`
          );

          let resolvedAddress = null;

          if (res.ok) {
            const json = await res.json();

            if (json?.address) {
              resolvedAddress = ethers.getAddress(json.address);
            }
          }

          if (resolvedAddress) {
            setIsValidScan(true);
            setScanFailed(false);
          } else {
            setScanAddress("");
            setScannedAddress(null);
            setIsValidScan(false);
            setHasScanned(false);
            setScanFailed(false);

            // Clear the invalid saved session
            sessionStorage.removeItem("revoky-session");
          }

        } catch (err) {
          console.error("Session bootstrap failed:", err);

          setIsValidScan(false);
        }
      }

      setIsHydrated(true);
    }

    bootstrapSession();
  }, []);
  
  // -------------------------------------
  // CACHE RESTORE
  // -------------------------------------
 
  useEffect(() => {
    if (DISABLE_CACHE) {
      clearCache(scanCacheRef);
      return;
    }

    const stored = sessionStorage.getItem("revoky-cache");

    if (stored) {
      scanCacheRef.current =
        JSON.parse(stored);
    }
  }, []);
  
  // -------------------------------------
  // MANUAL SCAN RESTORE
  // -------------------------------------
 
  useEffect(() => {
    const stored = sessionStorage.getItem("revoky-last-manual-scan");
  
    if (stored) {
      lastManualScanRef.current =
        JSON.parse(stored);
    }
  }, []);
  
  // -------------------------------------
  // PAGE STATE RESTORE 
  // -------------------------------------
 
  useEffect(() => {
    function restorePageState() {
      setError("");
  
      if (!isHydrated) return;

      // Parse the current URL into address, chain, and view state
      const { pathname } = window.location;

      const segments = pathname.split("/").filter(Boolean);
  
      const pathAddress = segments[0] || null;
      const pathChain = segments[1] || null;
      let pathView = null;
      let pathSort = null;

      if (segments[2]) {
        const v = segments[2];
  
        if (["all", "token", "nft"].includes(v)) {
          pathView = v;
        } else if (["value", "allowance", "age", "risk"].includes(v)) {
          pathSort = v;
        }
      }
  
      if (segments[3]) {
        const s = segments[3];

        if (["value", "allowance", "age", "risk"].includes(s)) {
          pathSort = s;
        }
      }

      // Validate the address from the URL
      let validAddress = null;
  
      if (pathAddress && ethers.isAddress(pathAddress)) {
        validAddress = ethers.getAddress(pathAddress);
      }
 
      const session = getSession();

      setSortOption(pathView ?? session.sortOption ?? "all");

      setSortMetric(pathSort ?? session.sortMetric ?? "value");
  
      setSortDirection(session.sortDirection ?? "desc");
  
      // Reset if the URL contains an invalid address  
      if (pathAddress && !validAddress) {
        setError("Invalid address in URL.");
  
        setTimeout(() => {
          resetToFreshSession({
            setters,
            refs,
          });
        }, 800);
  
        return;
      }

      // Restore the last session when no address is present in the URL  
      if (!validAddress) {
        setSortOption(session.sortOption || "all");

        setSortMetric(session.sortMetric || "value");

        setSortDirection(session.sortDirection || "desc");

        setCardLayout(session.cardLayout || "vertical");
 
        setSelectedChain(session.draft?.selectedChain || session.selectedChain || "ethereum");
  
        const chainSession = getActiveSession(session);

        const displayAddress = chainSession?.scanAddress ?? session.draft?.scanAddress ?? "";
  
        setScanAddress(displayAddress);

        setLastScannedInput(chainSession?.lastScannedInput ?? displayAddress);
  
        if (chainSession?.scannedAddress) {
          setScannedAddress(chainSession.scannedAddress);
  
          const cacheKey = getSessionKey(
            session.selectedChain,
            chainSession.scannedAddress,
          );

          // Retrieve cache
          const cached = DISABLE_CACHE ? null : getCache(
            scanCacheRef,
            cacheKey,
            DISABLE_CACHE,
            CACHE_TTL,
          );

          restoreOrFetchScan({
            cached,
            chainKey: session.selectedChain,
            address: chainSession.scannedAddress,
            originalInput: chainSession.lastScannedInput || chainSession.scanAddress,
          });

          return;
        }

        setScannedAddress(null);
        setHasScanned(false);
        setLoading(false);
  
        return;
      }

      // Restore state for the address provided in the URL
      const chainKey = pathChain ? parseChainFromUrl(
        pathChain,
        CHAINS,
      ) : "ethereum";
  
      const chainSession = getSessionScan(
        session,
        chainKey,
        validAddress,
      ) || {};  

      const displayAddress = chainSession.lastScannedInput || validAddress;

      setScanAddress(displayAddress);

      setScannedAddress(validAddress);
 
      setLastScannedInput(chainSession.lastScannedInput || "");

      setSelectedChain(chainKey);

      // Normalize the URL with the resolved chain
      if (!pathChain) {
        const resolvedView = pathView ?? session.sortOption ?? "all";
  
        const resolvedSort = pathSort ?? session.sortMetric ?? "value";
  
        updateUrl(
          validAddress,
          chainKey,
          resolvedView,
          resolvedSort
        );
      }
  
      const cacheKey = getSessionKey(
        chainKey,
        validAddress,
      );

      // Retrieve cache
      const cached = DISABLE_CACHE ? null : getCache(
        scanCacheRef,
        cacheKey,
        DISABLE_CACHE,
        CACHE_TTL,
      );
  
      restoreOrFetchScan({
        cached,
        chainKey,
        address: validAddress,
        originalInput: chainSession.lastScannedInput || validAddress,
      });
  
      return;
    }
  
    restorePageState();
  }, [isHydrated]);
  
  // -------------------------------------
  // SCREEN LISTENER
  // -------------------------------------
  
  useEffect(() => {
    const queries = [
      window.matchMedia("(max-width: 639px)"),
      window.matchMedia("(min-width: 640px) and (max-width: 1023px)"),
      window.matchMedia("(min-width: 1024px)")
    ];

    const update = () =>
      setScreen(state.getScreen());

    queries.forEach(q =>
      q.addEventListener("change", update)
    );

    return () => {
      queries.forEach(q =>
        q.removeEventListener("change", update)
      );
    };
  }, []);
  
  // -------------------------------------
  // THEME
  // -------------------------------------
 
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    sessionStorage.setItem(
      "theme-mode",
      darkMode ? "dark" : "light"
    );

  }, [darkMode]);
  
  // -------------------------------------
  // RECENT WALLETS
  // -------------------------------------
 
  useEffect(() => {
    setRecentWallets(
      getRecentWallets()
    );
  }, [
    getRecentWallets,
    setRecentWallets,
  ]);  
  
  // -------------------------------------
  // SESSION STATE PERSIST
  // -------------------------------------
  
  useEffect(() => {
    if (!isHydrated) return;
  
    const previous = getSession();
  
    const session = {
      ...previous,
      connectedAddress,
      walletActive,
      selectedChain,
      draft: {
        scanAddress,
        selectedChain,
      },
      sortOption,
      sortMetric,
      sortDirection,
      cardLayout,
      hasScanned,
      scanFailed,
    };
  
    sessionStorage.setItem(
      "revoky-session",
      JSON.stringify(session)
    );
  
  }, [
    connectedAddress,
    walletActive,
    selectedChain,
    scanAddress,
    scannedAddress,
    lastScannedInput,
    sortOption,
    sortMetric,
    sortDirection,
    cardLayout,
    hasScanned,
    scanFailed,
    isHydrated,
  ]);
  
  // -------------------------------------
  // MANUAL SCAN PERSIST
  // -------------------------------------
  
  useEffect(() => {
    if (!isHydrated) return;
  
    sessionStorage.setItem(
      "revoky-last-manual-scan",
      JSON.stringify(lastManualScanRef.current)
    );
  }, [
    hasScanned,
    scanFailed,
    isHydrated,
  ]);
}