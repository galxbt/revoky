// frontend/src/App.jsx

import { 
  AppProvider,
} from "./context";

import { 
  Landing,
  Result,
} from "./page";

import {
  Header,
  Footer,
  GlobalToast, 
  BackToTop,
  ExplanationModal, 
  ErrorBoundary,
} from "./components";

import {
  CHAINS,
  CHAIN_EXPLORERS,
  CHAIN_COLORS,
} from "./config";

import {
  truncateAddress,
  updateUrl,
  resetToFreshSession,
  getRecentWallets,
  saveRecentWallet,
  removeRecentWallet,
  clearRecentWallets,
} from "./utils";

import {
  useAppState,
  useApprovalEngine,
  useProcessedApprovals,
  useApprovalStats,
  useScanHandler,
  useWalletActions,
  useActiveWalletDisplay,
  useSessionManager,
  useAppEffects,
  useDataEffects,
  useUIEffects,
  useRevokeFlow,
} from "./hooks";

export default function App() {
  // Shared application state, setters, refs, and constants
  const { 
    state, 
    setters, 
    refs, 
    constants,
  } = useAppState();
  
  const {
    screen,
    isDark,
    approvals,
    addressMeta,
    accountInfo,
    selected,
    statusMap,
    txModal,
    loading,
    loadingTarget,
    hasScanned,
    scanFailed,
    error,
    isEnriched,
    isRefreshing,
    isHydrated,
    connecting,
    connectSwitching,
    isConnected,
    displayName,
    scanAddress,
    scannedAddress,
    now,
    lastUpdated,
    cacheHitFeedback,
    selectedChain,
    searchQuery,
    sortOption,
    sortMetric,
    sortDirection,
    visibleCount,
    loadStep,
    cardLayout,
    activeModal,
    toast,
    addressCopied,
    copiedKey,
    showChainDropdown,
    showAddressMenu,
    showDisconnectModal,
    showQuickLinks,
    showScrollTop,
    suggestedWallet,
    recentWallets,
    filteredRecentWallets,
    showRecent,
  } = state;
  
  const {
    setDarkMode,
    setAddressMeta,
    setSelected,
    setStatusMap,
    setTxModal,
    setLoadingTarget,
    setConnectedAddress,
    setWalletActive,
    setWalletChainId,
    setScanAddress,
    setSearchQuery,
    setSortOption,
    setSortMetric,
    setSortDirection,
    setVisibleCount,
    setCardLayout,
    setActiveModal,
    setToast,
    setAddressCopied,
    setCopiedKey,
    setShowChainDropdown,
    setShowAddressMenu,
    setShowDisconnectModal,
    setShowQuickLinks,
    setShowScrollTop,
    setRecentWallets,
    setShowRecent,
  } = setters;
  
  const {
    dropdownRef,
    addressMenuRef,
    loadMoreRef,
  } = refs;

  const handleSaveRecentWallet = (payload) =>
    saveRecentWallet({
      ...payload,
      setRecentWallets,
    });

  const handleRemoveRecentWallet = (resolved) =>
    removeRecentWallet(
      resolved,
      setRecentWallets
    );
  
  const handleClearRecentWallets = () =>
    clearRecentWallets(
      setRecentWallets
    );

  // -------------------------------------
  // HOOKS
  // -------------------------------------
  
  // Approval fetching and enrichment
  const {
    fetchApprovalsForAddress,
    enrichAddresses,
  } = useApprovalEngine({
    state,
    setters,
    refs,
    constants,
    helpers: {
      truncateAddress,
      saveRecentWallet:
        handleSaveRecentWallet,
    },
  });

  // Process, filter, sort, and select approvals
  const {
    processedApprovals,
    filteredWithoutSearch,
    tokenCount,
    nftCount,
    allFilteredSelected,
    handleSelectAll,
  } = useProcessedApprovals({
    state,
    setters,
  });

  // Derive wallet approval statistics
  const {
    walletRisk,
    totalApprovals,
    totalValueAtRisk,
    lastApproval,
    mostApproved,
  } = useApprovalStats({
    state,
  });

  // Handle manual scans and chain switching
  const {
    handleScan,
    handleChainChange,
  } = useScanHandler({
    state,
    setters,
    refs,
    constants,
    derived: {
      fetchApprovalsForAddress,
    },
  });

  // Manage wallet connection and network actions
  const {
    connectWallet,
    handleNetworkSwitch,
    handleRetrySwitch,
    startTimeoutSession,
    clearTimeoutSession,
    wasSessionCancelled,
  } = useWalletActions({
    state,
    setters,
    refs,
    helpers: {
      showToast,
    },
    derived: {
      fetchApprovalsForAddress,
    },
  });

  // Compute active wallet display information
  const {
    activeAddress,
    statusLabel,
    addressLabel,
    isConnectedView,
    hasAddress,
  } = useActiveWalletDisplay({
    state,
    setters,
    helpers: {
      truncateAddress,
    },
  });

  // Restore and maintain session state
  useSessionManager({
    state,
    setters,
    refs,
    constants,
    helpers: {
      getRecentWallets,
    },
    config: {
      CHAINS,
    },
    derived: {
      fetchApprovalsForAddress,
    },
  });

  // Run application lifecycle effects
  useAppEffects({
    state,
    setters,
  });

  // Synchronize app data and URL state
  useDataEffects({
    state,
    setters,
    helpers: {
      updateUrl,
      truncateAddress,
    },
    derived: {
      activeAddress,
    },
  });

  // Handle UI-specific side effects
  useUIEffects({
    state,
    setters,
    refs,
    derived: {
      processedApprovals,
      enrichAddresses,
    },
  });

  // Execute single and batch revoke flows
  const {
    handleBatchRevoke,
    handleSingleRevoke,
    TX_STATES,
    BATCH_KEY,
  } = useRevokeFlow({
    state,
    setters,
    refs,
    helpers: {
      truncateAddress,
      showToast,
    },
    config: {
      CHAIN_EXPLORERS,
    },
    walletActions: {
      handleNetworkSwitch,
      handleRetrySwitch,
      startTimeoutSession,
      clearTimeoutSession,
      wasSessionCancelled,
    },
  });

  // -------------------------------------
  // FUNCTIONS
  // -------------------------------------
  
  // Reset the app to the landing state
  function goToLanding() {
    if (loading) return;
  
    resetToFreshSession({
      setters,
      refs,
    });
  
    setConnectedAddress(null);
    setWalletActive(false);
    setWalletChainId(null);
    setAddressMeta({});
    setStatusMap({});
    setTxModal(null);
    setLoadingTarget(null);
    setSearchQuery("");
    setSortOption("all");
    setSortMetric("value");
    setSortDirection("desc");
    setVisibleCount(loadStep);
    setActiveModal(null);
  }

  // Display a temporary toast notification
  function showToast(message, type = "error") {
    setToast({ message, type });
  
    clearTimeout(window.toastTimer);
  
    window.toastTimer = setTimeout(() => {
      setToast(null);
    }, 4000);
  }

  // Copy text to the clipboard with feedback
  async function copyToClipboard(text, key) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
  
      setTimeout(() => {
        setCopiedKey(null);
      }, 1500);
    } catch {
      alert("Copy failed");
    }
  }

  // -------------------------------------
  // CONTEXT
  // -------------------------------------

  const sharedProps = {
    // User interface state and controls
    ui: {
      screen,
      isDark,
      setDarkMode,
      loading,
      loadingTarget,     
      hasScanned,
      scanFailed,
      error,
      isEnriched,
      visibleCount,
      cardLayout,
      setCardLayout,
      loadMoreRef,
      lastUpdated,
      isRefreshing,
      cacheHitFeedback,
      now,
      toast,
      setToast,
      showScrollTop,
      setShowScrollTop,
    },

    // Wallet state and connection actions
    wallet: {
      connectWallet,
      connecting,
      connectSwitching,
      isConnected,
      setConnectedAddress,
      setWalletActive,
      displayName,
      activeAddress,
      statusLabel,
      addressLabel,
      isConnectedView,
      hasAddress,
      accountInfo,
      walletRisk,
    },

    // Wallet scanning state and actions
    scan: {
      scanAddress,
      setScanAddress,
      scannedAddress,
      handleScan,
      handleChainChange,
    },

    // Approval management and revoke flow
    flow: {
      approvals,
      processedApprovals,
      addressMeta,
      selected,
      setSelected,
      allFilteredSelected,
      handleSelectAll,
      handleBatchRevoke,
      handleSingleRevoke,
      statusMap,
      TX_STATES,
      BATCH_KEY,
      txModal,
      setTxModal,
    },

    // Derived approval statistics
    stats: {
      tokenCount,
      nftCount,
      totalApprovals,
      totalValueAtRisk,
      lastApproval,
      mostApproved,
    },

    // Recent wallet history and actions
    recent: {
      recentWallets,
      filteredRecentWallets,
      setRecentWallets,
      showRecent,
      setShowRecent,
      suggestedWallet,
      removeRecentWallet:
        handleRemoveRecentWallet,
      clearRecentWallets:
        handleClearRecentWallets,
    },

    // Search, sorting, menus, and modal controls
    controls: {
      dropdownRef,
      showChainDropdown,
      setShowChainDropdown,
      addressMenuRef,
      showAddressMenu,
      setShowAddressMenu,
      showDisconnectModal,
      setShowDisconnectModal,
      showQuickLinks,
      setShowQuickLinks,
      activeModal,
      setActiveModal,
      searchQuery,
      setSearchQuery,
      sortOption,
      setSortOption,
      sortMetric,
      setSortMetric,
      sortDirection,
      setSortDirection,
      filteredWithoutSearch,
    },

    // Shared utility functions and clipboard state
    utils: {
      truncateAddress,
      copyToClipboard,
      addressCopied,
      setAddressCopied,
      copiedKey,
      setCopiedKey,
    },

    // Chain configuration and metadata
    config: {
      selectedChain,
      CHAINS,
      CHAIN_EXPLORERS,
      CHAIN_COLORS,
    },
  };

  // -------------------------------------
  // USER INTERFACE 
  // -------------------------------------
 
  // Wait for persisted app state to finish loading
  if (!isHydrated) return null;
  
  // Show the result page after a scan or scan failure
  const showResult = hasScanned || scanFailed;

  return (
    <div
      style={{
        display: "flex",  
        flexDirection: "column",
        background: isDark ? "#0f172a" : "#ffffff",
        color: isDark ? "#f1f5f9" : "#111111",
        minHeight: "100dvh",
      }}
    >
      {/* Header */}
      <Header
        screen={screen}
        isDark={isDark}
        loading={loading}
        goToLanding={goToLanding}
      />

      {/* Main Content */}
      <div style={{ flex: 1 }}>      
        <div
          className="app-container"
          style={{ paddingTop: 72 }}
        >
          <AppProvider value={sharedProps}>
            <ErrorBoundary>
              { showResult ? <Result /> : <Landing /> }
            </ErrorBoundary>
            <GlobalToast />
            <BackToTop />          
          </AppProvider>

          {activeModal && (
            <ExplanationModal
              modal={activeModal}
              isDark={isDark}
              approvals={approvals}
              selectedChain={selectedChain}
              onClose={() => setActiveModal(null)}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer 
        screen={screen}
        isDark={isDark} 
        loading={loading}
        goToLanding={goToLanding}
      />
    </div>
  );
}