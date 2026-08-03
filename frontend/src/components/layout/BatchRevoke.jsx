// frontend/src/components/layout/BatchRevoke.jsx

import { TxStatus } from "@/components/approvals";
import { isLowEnd } from "@/utils/device";

export default function BatchRevoke({
  approvals,
  processedApprovals,
  hasProcessedApprovals,
  isConnectedView,
  selectedChain,
  isDark,
  isBatchLoading,
  isBatchBusy,
  isBatchSuccess,
  allFilteredSelected,
  selectedCount,
  handleSelectAll,
  handleBatchClick,
  batchStatus,
  batchProgress,
  batch,
  activeAddress,
  CHAIN_EXPLORERS,
  setTxModal,
  TX_STATES,
  config,
}) {
  const {
    marginTop,
    gap,
    selectWidth,
    selectRadius,
    selectIconSize,
    revokePadding,
    revokeRadius,
    revokeGap,
    revokeFontSize,
    spinnerSize,
    txStatusMarginBottom,
    txStatusScreen,
  } = config;

  if (
    approvals.length === 0 ||
    !hasProcessedApprovals ||
    !isConnectedView ||
    selectedChain === "all"
  ) {
    return null;
  }

  const buttonLabel =
    batchStatus === TX_STATES.SUCCESS
      ? "Revoke Successful!"
  
      : batchStatus === TX_STATES.SWITCHING
      ? "Switching..."
  
      : batchStatus === TX_STATES.SIGNING
      ? `Confirm ${batchProgress?.current || 0}/${batchProgress?.total || 0}`
  
      : batchStatus === TX_STATES.SUBMITTED
      ? `Revoking ${batchProgress?.current || 0}/${batchProgress?.total || 0}`
  
      : selectedCount > 0
      ? `Revoke (${selectedCount}/${processedApprovals.length})`
  
      : "Revoke";

  return (
    <>
      <div
        style={{
          display: "flex",
          gap,
          marginTop,
          alignItems: "stretch",
        }}
      >
        {/* SELECT ALL */}
        {!isBatchLoading && (
          <button
            onClick={() => {
              if (!hasProcessedApprovals || isBatchBusy) {
                return;
              }
              handleSelectAll();
            }}
            disabled={!hasProcessedApprovals || isBatchBusy}
            style={{
              width: selectWidth,
              minWidth: selectWidth,
              borderRadius: selectRadius,
              border: "none",
              cursor: !hasProcessedApprovals || isBatchBusy ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: allFilteredSelected ? "#3b82f6" : isDark ? "#334155" : "#e5e7eb",
              opacity: !hasProcessedApprovals ? 0.5 : 1,
              transition: "all 0.2s ease",
            }}
          >
            {allFilteredSelected ? (
              <svg
                width={selectIconSize}
                height={selectIconSize}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <line
                  x1="6"
                  y1="12"
                  x2="18"
                  y2="12"
                />
              </svg>
            ) : (
              <svg
                width={selectIconSize}
                height={selectIconSize}
                viewBox="0 0 24 24"
                fill="none"
                stroke={isDark ? "#fff" : "#111"}
                strokeWidth="2"
              >
                <polyline points="6 12 10 16 18 8" />
              </svg>
            )}
          </button>
        )}

        {/* REVOKE */}
        <button
          onClick={handleBatchClick}
          disabled={isBatchBusy || selectedCount === 0}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: revokeGap,
            padding: revokePadding,
            borderRadius: revokeRadius,
            border: "none",
            background: isBatchSuccess
              ? (isDark ? "#1e293b" : "#f3f4f6")
              : isBatchLoading ? "#ef4444" : "#ff4c4c",
            color: isBatchSuccess ? "#22c55e" : "#fff",
            fontWeight: isBatchSuccess ? 700 : 600,
            boxShadow: isBatchSuccess ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
            fontSize: revokeFontSize,
            opacity: selectedCount === 0 ? 0.6 : 1,
            cursor: selectedCount === 0 || isBatchBusy ? "not-allowed" : "pointer",
            animation: isLowEnd ? "none" : "successPop 0.35s ease",
            transformOrigin: "center",
          }}
        >
          {isBatchLoading && (
            <svg
              width={spinnerSize}
              height={spinnerSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: "spin 1s linear infinite",
                transformOrigin: "center",
              }}
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                opacity="0.3"
              />
              <path d="M21 12a9 9 0 0 1-9 9" />
            </svg>
          )}

          <span
            style={{
              cursor: "default",
              color: isBatchSuccess ? "#22c55e" : "#fff",
              fontWeight: isBatchSuccess ? 700 : 600,
            }}
          >
            {buttonLabel}
          </span>
        </button>
      </div>

      {/* STATUS */}
      {batchStatus && (
        <div
          style={{ marginBottom: txStatusMarginBottom }}
        >
          <TxStatus
            status={batchStatus}
            txUrl={batch?.txUrl}
            txUrls={batch?.txUrls}
            walletAddress={activeAddress}
            selectedChain={selectedChain}
            CHAIN_EXPLORERS={CHAIN_EXPLORERS}
            setTxModal={setTxModal}
            isDark={isDark}
            TX_STATES={TX_STATES}
            progress={batchProgress}
            isBatch={true}
            screen={txStatusScreen}
          />
        </div>
      )}
    </>
  );
}