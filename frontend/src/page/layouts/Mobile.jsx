// frontend/src/page/layouts/Mobile.jsx

import { useAppContext } from "@/context/hooks";
import { useApprovalsState } from "@/hooks/useApprovalsState";
import { MOBILE_CONFIG } from "@/config/deviceConfig";
import { safeMap } from "@/utils/list";
import { getApprovalKey } from "@/utils/helpers";
import { ApprovalRowMob } from "@/components/approvals";

import {
  TopControls,
  DarkModeToggle,
  ChainTrigger,
  ScanInput,
  ScanButton,
  ScanStatus,
  InlineWarning,
  ErrorMessage,
  WalletOverview,
  WalletHeader,
  AccountMeta,
  QuickLinks,
  DisconnectModal,
  SummaryCard,
  ExternalArrow,
  ConnectNotice,
  SortFilter,
  CardLayoutSwitch,
  SearchFilter,
  BatchRevoke,
  InfiniteScrollLoader,
  TxModal,
  FetchErrorState,
  EmptyState,
} from "@/components/layout";

export default function Mobile() {
  const {
    ui,
    wallet,
    scan,
    flow,
    stats,
    recent,
    controls,
    utils,
    config,
  } = useAppContext();

  const {
    isDark,
    setDarkMode,
    loading,
    loadingTarget,
    error,
    scanFailed,
    hasScanned,
    isEnriched,
    visibleCount,
    cardLayout,
    setCardLayout,
    loadMoreRef,
    lastUpdated,
    isRefreshing,
    cacheHitFeedback,
    now,
  } = ui;
  
  const {
    setConnectedAddress,
    connectWallet,
    connectSwitching,
    setWalletActive,
    activeAddress,
    statusLabel,
    addressLabel,
    isConnectedView,
    hasAddress,
    accountInfo,
    walletRisk,
  } = wallet;
  
  const {
    scanAddress,
    setScanAddress,
    handleScan,
    handleChainChange,
  } = scan;
  
  const {
    approvals,
    processedApprovals,
    selected,
    allFilteredSelected,
    handleSelectAll,
    handleBatchRevoke,
    statusMap,
    TX_STATES,
    BATCH_KEY,
    txModal,
    setTxModal,
  } = flow;
  
  const {
    tokenCount,
    nftCount,
    totalApprovals,
    totalValueAtRisk,
    lastApproval,
    mostApproved,
  } = stats;
  
  const {
    filteredRecentWallets,
    showRecent,
    setShowRecent,
    removeRecentWallet,
    clearRecentWallets,
  } = recent;
  
  const {
    dropdownRef,
    showChainDropdown,
    setShowChainDropdown,
    showDisconnectModal,
    setShowDisconnectModal,
    showQuickLinks,
    setShowQuickLinks,
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
  } = controls;
  
  const {
    truncateAddress,
    addressCopied,
    setAddressCopied,
  } = utils;
  
  const {
    selectedChain,
    CHAINS,
    CHAIN_EXPLORERS,
  } = config;
  
  const approvalsState = useApprovalsState({
    approvals,
    processedApprovals,
    selected,
    visibleCount,
    hasScanned,
    loading,
    loadingTarget,
    isRefreshing,
    error,
    scanFailed,
    isEnriched,
    totalValueAtRisk,
    lastApproval,
    mostApproved,
    isDark,
    handleBatchRevoke,
    statusMap,
    TX_STATES,
    BATCH_KEY,
  });
  
  const {
    hasApprovals,
    isSkeletonLoading,
    isFetchErrorState,
    showRefreshWarning,
    isEmptyState,
    rows,
    borderStyle,
    isTotalApprovalsReady,
    isValueReady,
    isLastApprovalReady,
    isMostApprovedReady,
    primary,
    valueColor,
    selectedCount,
    hasProcessedApprovals,
    handleBatchClick,
    batch,
    batchStatus,
    batchProgress,
    isBatchBusy,
    isBatchLoading,
    isBatchSuccess,
  } = approvalsState;
  
  return (
    <div>
      {/* TOP CONTROLS */}
      <TopControls config={MOBILE_CONFIG.topControls}>
        <DarkModeToggle
          isDark={isDark}
          setDarkMode={setDarkMode}
          config={MOBILE_CONFIG.darkMode}
        />
        <ChainTrigger
          dropdownRef={dropdownRef}
          showChainDropdown={showChainDropdown}
          setShowChainDropdown={setShowChainDropdown}
          selectedChain={selectedChain}
          CHAINS={CHAINS}
          isDark={isDark}
          handleChainChange={handleChainChange}
          config={MOBILE_CONFIG.chainTrigger}
        />
      </TopControls>

			{/* SCAN INPUT */}
      <ScanInput
        isDark={isDark}
        scanAddress={scanAddress}
        setScanAddress={setScanAddress}
        showRecent={showRecent}
        setShowRecent={setShowRecent}
        filteredRecentWallets={filteredRecentWallets}
        clearRecentWallets={clearRecentWallets}
        removeRecentWallet={removeRecentWallet}
        handleScan={handleScan}
        truncateAddress={truncateAddress}
        config={MOBILE_CONFIG.scanInput}
      />
  
      {/* SCAN WALLET */}
      <ScanButton
        isDark={isDark}
        scanAddress={scanAddress}
        loading={loading}
        handleScan={handleScan}
        config={MOBILE_CONFIG.scanWallet}
      />

      {/* SCAN STATUS */}
      <ScanStatus
        isDark={isDark}
        isRefreshing={isRefreshing}
        cacheHitFeedback={cacheHitFeedback}
        lastUpdated={lastUpdated}
        now={now}
        config={MOBILE_CONFIG.scanStatus}
      />

      {/* REFRESH WARNING */}
      {showRefreshWarning && (
        <InlineWarning 
          isDark={isDark}
          config={MOBILE_CONFIG.inLineWarning}
        >
          Unable to refresh.
          Showing last scanned results.
        </InlineWarning>
      )}

      {/* ERROR MESSAGE */}
      <ErrorMessage
        error={error}
        isDark={isDark}
      />

      {/* DIVIDER */}
      <hr style={{ margin: "10px 0" }} />

      {/* WALLET OVERVIEW */}
      {!isSkeletonLoading && !isFetchErrorState && hasAddress && (
        <WalletOverview
          isDark={isDark}
          config={MOBILE_CONFIG.walletOverview}
        >
          <WalletHeader
            isDark={isDark}
            isConnectedView={isConnectedView}
            statusLabel={statusLabel}
            addressLabel={addressLabel}
            activeAddress={activeAddress}
            addressCopied={addressCopied}
            setAddressCopied={setAddressCopied}
            connectSwitching={connectSwitching}
            connectWallet={connectWallet}
            setShowDisconnectModal={setShowDisconnectModal}
            config={MOBILE_CONFIG.walletHeader}
          />

          <AccountMeta
            isDark={isDark}
            isEnriched={isEnriched}
            accountInfo={accountInfo}
            walletRisk={walletRisk}
            setActiveModal={setActiveModal}
            showQuickLinks={showQuickLinks}
            setShowQuickLinks={setShowQuickLinks}
            config={MOBILE_CONFIG.accountMeta}
          />

          <QuickLinks
            isDark={isDark}
            activeAddress={activeAddress}
            selectedChain={selectedChain}
            CHAIN_EXPLORERS={CHAIN_EXPLORERS}
            showQuickLinks={showQuickLinks}
            config={MOBILE_CONFIG.quickLinks}
          />

          <DisconnectModal
            isDark={isDark}
            isOpen={isConnectedView && showDisconnectModal}
            setShowDisconnectModal={setShowDisconnectModal}
            setConnectedAddress={setConnectedAddress}
            setWalletActive={setWalletActive}
            config={MOBILE_CONFIG.disconnectModal
            }
          />
        </WalletOverview>
      )}

      {/* SUMMARY CARD */}
      {!isSkeletonLoading && !isFetchErrorState && (
        <SummaryCard
          isDark={isDark}
          totalApprovals={totalApprovals}
          totalValueAtRisk={totalValueAtRisk}
          lastApproval={lastApproval}
          mostApproved={mostApproved}
          isTotalApprovalsReady={isTotalApprovalsReady}
          isValueReady={isValueReady}
          isLastApprovalReady={isLastApprovalReady}
          isMostApprovedReady={isMostApprovedReady}
          valueColor={valueColor}
          primary={primary}
          selectedChain={selectedChain}
          CHAIN_EXPLORERS={CHAIN_EXPLORERS}
          setActiveModal={setActiveModal}
          config={MOBILE_CONFIG.summaryCard}
          externalArrow={<ExternalArrow size={14} />}
        />
      )}

      {/* APPROVAL UI */}
      {hasApprovals && (
        <>
          {/* CONNECT NOTICE */}
          <ConnectNotice
            approvals={approvals}
            selectedChain={selectedChain}
            isConnectedView={isConnectedView}
            config={MOBILE_CONFIG.connectNotice}
          />

          {/* BORDER WRAPPER */}
          <div style={borderStyle}>
 
            {/* SORT & FILTER */}
            <SortFilter
              approvals={approvals}
              isDark={isDark}
              sortOption={sortOption}
              setSortOption={setSortOption}
              sortMetric={sortMetric}
              setSortMetric={setSortMetric}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              tokenCount={tokenCount}
              nftCount={nftCount}
              config={MOBILE_CONFIG.sortFilter}
            />

            {/* LAYOUT SWITCH */}
            <CardLayoutSwitch
              approvals={approvals}
              cardLayout={cardLayout}
              setCardLayout={setCardLayout}
              isDark={isDark}
            />

            {/* SEARCH & FILTER */}
            <SearchFilter
              approvals={approvals}
              filteredWithoutSearch={filteredWithoutSearch}
              processedApprovals={processedApprovals}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortOption={sortOption}
              isDark={isDark}
              config={MOBILE_CONFIG.searchFilter}
            />

            {/* BATCH REVOKE */}
            <BatchRevoke
              approvals={approvals}
              processedApprovals={processedApprovals}
              hasProcessedApprovals={hasProcessedApprovals}
              isConnectedView={isConnectedView}
              selectedChain={selectedChain}
              isDark={isDark}
              isBatchLoading={isBatchLoading}
              isBatchBusy={isBatchBusy}
              isBatchSuccess={isBatchSuccess}
              allFilteredSelected={allFilteredSelected}
              selectedCount={selectedCount}
              handleSelectAll={handleSelectAll}
              handleBatchClick={handleBatchClick}
              batchStatus={batchStatus}
              batchProgress={batchProgress}
              batch={batch}
              activeAddress={activeAddress}
              CHAIN_EXPLORERS={CHAIN_EXPLORERS}
              setTxModal={setTxModal}
              TX_STATES={TX_STATES}
              config={MOBILE_CONFIG.batchRevoke}
            />

            {/* APPROVAL CARDS */}
            {processedApprovals.length > 0 && (
              <div
                className="scroll-hide"
                style={{
                  marginTop: 10,
                  // maxHeight: "100vh",
                  overflowX: "auto",
                  overflowY: "auto",
                  WebkitOverflowScrolling: "touch",
                  willChange: "transform",
                }}
              >
                {/* ROWS */}                
                {safeMap(
                  rows,
                  (a) => (
                    <ApprovalRowMob
                      key={getApprovalKey(a)}
                      a={a}
                      cardLayout={cardLayout}
                    />
                  ),
                  (a) => getApprovalKey(a)
                )}
  
                {/* INFINITE SCROLL */}
                <InfiniteScrollLoader
                  visibleCount={visibleCount}
                  totalCount={processedApprovals.length}
                  loadMoreRef={loadMoreRef}
                  config={MOBILE_CONFIG.infiniteScrollLoader}
                />
              </div>
            )}
          </div>    
        </>
      )}   

      {/* TX MODAL*/}
      <TxModal
        txModal={txModal}
        setTxModal={setTxModal}
        isDark={isDark}
      />

      {/* FETCH ERROR */}
      {isFetchErrorState && (
        <FetchErrorState
          isDark={isDark}
          error={error}
          onRetry={() => handleScan(scanAddress)}
          config={MOBILE_CONFIG.fetchErrorState}
        />
      )}
  
      {/* EMPTY STATE */}
      <EmptyState
        isDark={isDark}
        isEmptyState={isEmptyState}
        config={MOBILE_CONFIG.emptyState}
      />

    </div>
  );
}