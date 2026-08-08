// frontend/src/page/layouts/Tablet.jsx

import { useAppContext } from "@/context/hooks";
import { useApprovalsState } from "@/hooks/useApprovalsState";
import { TABLET_CONFIG } from "@/config/deviceConfig";
import { safeMap } from "@/utils/list";
import { getApprovalKey } from "@/utils/helpers";
import { ApprovalRow } from "@/components/approvals";

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
  SearchFilter,
  BatchRevoke,
  InfiniteScrollLoader,
  TxModal,
  FetchErrorState,
  EmptyState,
} from "@/components/layout";

export default function Tablet() {
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
      <TopControls config={TABLET_CONFIG.topControls}>
        <DarkModeToggle
          isDark={isDark}
          setDarkMode={setDarkMode}
          config={TABLET_CONFIG.darkMode}
        />

        <ChainTrigger
          dropdownRef={dropdownRef}
          showChainDropdown={showChainDropdown}
          setShowChainDropdown={setShowChainDropdown}
          selectedChain={selectedChain}
          CHAINS={CHAINS}
          isDark={isDark}
          handleChainChange={handleChainChange}
          config={TABLET_CONFIG.chainTrigger}
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
        config={TABLET_CONFIG.scanInput}
      />

			{/* SCAN WALLET */}
      <ScanButton
        isDark={isDark}
        scanAddress={scanAddress}
        loading={loading}
        handleScan={handleScan}
        config={TABLET_CONFIG.scanWallet}
      />

      {/* SCAN STATUS */}
      <ScanStatus
        isDark={isDark}
        isRefreshing={isRefreshing}
        cacheHitFeedback={cacheHitFeedback}
        lastUpdated={lastUpdated}
        now={now}
        config={TABLET_CONFIG.scanStatus}
      />

      {/* REFRESH WARNING */}
      {showRefreshWarning && (
        <InlineWarning 
          isDark={isDark}
          config={TABLET_CONFIG.inLineWarning}
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
      <hr style={{ margin: "15px 0" }} />

      {/* OVERVIEW PANELS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          alignItems: "stretch",
        }}
      >
        {/* WALLET OVERVIEW */}
        {!isSkeletonLoading && !isFetchErrorState && hasAddress && (
          <WalletOverview
            isDark={isDark}
            config={TABLET_CONFIG.walletOverview}
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
              config={TABLET_CONFIG.walletHeader}
            />

            <AccountMeta
              isDark={isDark}
              isEnriched={isEnriched}
              accountInfo={accountInfo}
              walletRisk={walletRisk}
              setActiveModal={setActiveModal}
              config={TABLET_CONFIG.accountMeta}
            />

            <QuickLinks
              isDark={isDark}
              activeAddress={activeAddress}
              selectedChain={selectedChain}
              CHAIN_EXPLORERS={CHAIN_EXPLORERS}
              config={TABLET_CONFIG.quickLinks}
            />

            <DisconnectModal
              isDark={isDark}
              isOpen={isConnectedView && showDisconnectModal}
              setShowDisconnectModal={setShowDisconnectModal}
              setConnectedAddress={setConnectedAddress}
              setWalletActive={setWalletActive}
              config={TABLET_CONFIG.disconnectModal
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
            config={TABLET_CONFIG.summaryCard}
            externalArrow={<ExternalArrow size={16} />}            
          />
        )}              
      </div>   

      {/* CONNECT NOTICE */}
      <ConnectNotice
        approvals={approvals}
        selectedChain={selectedChain}
        isConnectedView={isConnectedView}
        config={TABLET_CONFIG.connectNotice}
      />

      {/* BORDER WRAPPER */}
      {hasApprovals && (
        <>
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
              config={TABLET_CONFIG.sortFilter}
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
              config={TABLET_CONFIG.searchFilter}
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
              config={TABLET_CONFIG.batchRevoke}
            />

            {/* APPROVAL CARDS */}
            {processedApprovals.length > 0 && (
              <div
                style={{
                  marginTop: 10,
                  borderRadius: 16,
                  border: isDark ? "2px solid #334155" : "2px solid #e5e7eb",
                  overflow: "hidden",
               }}
              >
                {/* SCROLL CONTAINER */}
                <div
                  className="scroll-hide"
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    overflowX: "auto",
                    overflowY: "auto",   
                    scrollBehavior: "smooth",
                  }}
                >
                  {/* INNER WRAPPER */}
                  <div style={{minWidth: "max-content"}}>
 
                    {/* HEADER */}
                    <ApprovalRow.Header
                      isDark={isDark}
                    />

                    {/* ROWS */}
                    {safeMap(
                      rows,
                      (a) => (
                        <ApprovalRow
                          key={getApprovalKey(a)}
                          a={a}
                        />
                      ),
                      (a) => getApprovalKey(a)
                    )}                 
                  </div>  

                  {/* INFINITE SCROLL */}
                  <InfiniteScrollLoader
                    visibleCount={visibleCount}
                    totalCount={processedApprovals.length}
                    loadMoreRef={loadMoreRef}
                    config={TABLET_CONFIG.infiniteScrollLoader}
                  />
                </div>  
              </div>
            )}   
          </div>   
        </>
      )}   

      {/* FETCH ERROR */}
      {isFetchErrorState && (
        <FetchErrorState
          isDark={isDark}
          error={error}
          onRetry={() => handleScan(scanAddress)}
          config={TABLET_CONFIG.fetchErrorState}
        />
      )}

      {/* EMPTY STATE */}
      <EmptyState
        isDark={isDark}
        isEmptyState={isEmptyState}
        config={TABLET_CONFIG.emptyState}
      />

      {/* TX MODAL*/}
      <TxModal
        txModal={txModal}
        setTxModal={setTxModal}
        isDark={isDark}
      />

    </div>
  );
}