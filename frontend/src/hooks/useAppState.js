// frontend/src/hooks/useAppState.js

import { CHAINS } from "../config/chains";
import { CACHE_CONFIG } from "../config/cache";

import { 
  useState, 
  useRef, 
  useMemo, 
  useEffect,
} from "react";

export function useAppState() {
  const DISABLE_CACHE = CACHE_CONFIG.DISABLE;
  const CACHE_TTL = CACHE_CONFIG.TTL;
  
  const REFRESH_THRESHOLD = 0.8;
  const BG_REFRESH_INTERVAL = 3 * 60 * 1000;
  const MANUAL_REFRESH_INTERVAL = 3 * 60 * 1000;
  
  const scanCacheRef = useRef({});
  const ownerCacheRef = useRef({});
  const bytecodeCacheRef = useRef({});
  
  const requestIdRef = useRef(0);
  const lastBgRefreshRef = useRef({});
  const lastManualScanRef = useRef({});
  
  const timeoutRefs = useRef({});
  const cancelRefs = useRef({});
  
  const dropdownRef = useRef(null);
  const addressMenuRef = useRef(null);
  
  const loadMoreRef = useRef(null);
  const loadingMoreRef = useRef(false);
  
  const [loading, setLoading] = useState(false);
  const [loadingTarget, setLoadingTarget] = useState(null);
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  
  const [now, setNow] = useState(() => Date.now());
  const [lastUpdated, setLastUpdated] = useState(null);
  const [cacheHitFeedback, setCacheHitFeedback] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEnriched, setIsEnriched] = useState(false);
  const [scanFailed, setScanFailed] = useState(false);
  
  const [selectedChain, setSelectedChain] = useState("ethereum");
  
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [walletChainId, setWalletChainId] = useState(null);
  const [walletActive, setWalletActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectSwitching, setConnectSwitching] = useState(false);
  
  const [scanAddress, setScanAddress] = useState("");
  const [scannedAddress, setScannedAddress] = useState(null);
  const [lastScannedInput, setLastScannedInput] = useState("");
  const [displayName, setDisplayName] = useState(null);
  const [isValidScan, setIsValidScan] = useState(null);
  const [hasScanned, setHasScanned] = useState(false);
  
  const [approvals, setApprovals] = useState([]);
  const [backendData, setBackendData] = useState(null);
  const [addressMeta, setAddressMeta] = useState({});
  const [accountInfo, setAccountInfo] = useState(null);
  const [selected, setSelected] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [txModal, setTxModal] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("all");
  const [sortMetric, setSortMetric] = useState("value");
  const [sortDirection, setSortDirection] = useState("desc");
  
  const loadStep = useMemo(() => {
    const cores = navigator.hardwareConcurrency || 4;
  
    if (cores <= 2) return 4;
    if (cores <= 4) return 6;
    return 10;
  }, []);
  
  const [visibleCount, setVisibleCount] = useState(loadStep);
  
  const [recentWallets, setRecentWallets] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  
  const [cardLayout, setCardLayout] = useState("vertical");
  const [activeModal, setActiveModal] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [addressCopied, setAddressCopied] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showAddressMenu, setShowAddressMenu] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showDisconnectTooltip, setShowDisconnectTooltip, ] = useState(false);
  const [showQuickLinks, setShowQuickLinks] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [animatedIds, setAnimatedIds] = useState(new Set());
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = sessionStorage.getItem("theme-mode");

    if (saved) {
      return saved === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  
  const isDark = darkMode;
  
  const getScreen = () => ({
    isMobile: window.matchMedia("(max-width: 639px)").matches,
  
    isTablet: window.matchMedia("(min-width: 640px) and (max-width: 1023px)").matches,
  
    isDesktop: window.matchMedia("(min-width: 1024px)").matches,
  });
  
  const [screen, setScreen] = useState(getScreen());
  
  const isConnected = walletActive && !!connectedAddress;
  
  const suggestedWallet = useMemo(() => {
    if (!connectedAddress) {
      return null;
    }
  
    const ens = displayName && displayName.endsWith(".eth") ? displayName : null;
  
    return {
      id: "connected-wallet",
      input: ens || connectedAddress,
      resolved: connectedAddress,
      ens,
      isSuggested: true,
    };
  }, [
    connectedAddress,
    displayName,
  ]);
  
  const filteredRecentWallets = useMemo(() => {
    const query = scanAddress.trim().toLowerCase();

    let baseList = recentWallets;

    if (query) {
      baseList = recentWallets.filter((item) => {
        return (
          item.input
            .toLowerCase()
            .includes(query) ||
          item.resolved
            .toLowerCase()
            .includes(query)
        );
      });
    }
  
    if (!query && suggestedWallet) {
      baseList = [
        suggestedWallet,
        ...baseList.filter(
          (item) =>
            item.resolved.toLowerCase() !==
            suggestedWallet.resolved.toLowerCase()
        ),
      ];
    }
  
    return baseList;
  }, [
    scanAddress,
    recentWallets,
    suggestedWallet,
  ]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);
  
    return () =>
      clearInterval(interval);
  }, []);
  
  return {
    state: {
      now,
      lastUpdated,
      cacheHitFeedback,
      isRefreshing,
      isHydrated,
      isEnriched,
      loadingTarget,
      scanFailed,
      selectedChain,
      connectedAddress,
      walletChainId,
      walletActive,
      connectSwitching,
      connecting,
      scanAddress,
      scannedAddress,
      lastScannedInput,
      displayName,
      isValidScan,
      loading,
      hasScanned,
      error,
      suggestedWallet,
      isConnected,
      approvals,
      backendData,
      addressMeta,
      accountInfo,
      selected,
      statusMap,
      txModal,
      searchQuery,
      sortOption,
      sortMetric,
      sortDirection,
      visibleCount,
      loadStep,
      recentWallets,
      filteredRecentWallets,
      showRecent,
      cardLayout,
      activeModal,
      toast,
      addressCopied,
      copiedKey,
      showChainDropdown,
      showAddressMenu,
      showDisconnectModal,
      showDisconnectTooltip,
      showQuickLinks,
      showScrollTop,
      animatedIds,
      darkMode,
      isDark,
      screen,
      getScreen,
    },
  
    setters: {
      setLastUpdated,
      setCacheHitFeedback,
      setIsRefreshing,
      setIsHydrated,
      setIsEnriched,
      setLoadingTarget,
      setScanFailed,
      setSelectedChain,
      setConnectedAddress,
      setWalletChainId,
      setWalletActive,
      setConnectSwitching,
      setConnecting,
      setScanAddress,
      setScannedAddress,
      setLastScannedInput,
      setDisplayName,
      setIsValidScan,
      setLoading,
      setHasScanned,
      setError,
      setApprovals,
      setBackendData,
      setAddressMeta,
      setAccountInfo,
      setSelected,
      setStatusMap,
      setTxModal,
      setSearchQuery,
      setSortOption,
      setSortMetric,
      setSortDirection,
      setVisibleCount,
      setRecentWallets,
      setShowRecent,
      setCardLayout,
      setActiveModal,
      setToast,
      setAddressCopied,
      setCopiedKey,
      setShowChainDropdown,
      setShowAddressMenu,
      setShowDisconnectModal,
      setShowDisconnectTooltip,
      setShowQuickLinks,
      setShowScrollTop,
      setAnimatedIds,
      setDarkMode,
      setScreen,
    },
  
    refs: {
      scanCacheRef,
      ownerCacheRef,
      bytecodeCacheRef,
      requestIdRef,
      lastBgRefreshRef,
      lastManualScanRef,
      dropdownRef,
      addressMenuRef,
      timeoutRefs,
      cancelRefs,
      loadMoreRef,
      loadingMoreRef,
    },
  
    constants: {
      DISABLE_CACHE,
      CACHE_TTL,
      REFRESH_THRESHOLD,
      BG_REFRESH_INTERVAL,
      MANUAL_REFRESH_INTERVAL,
    },
  };
}