// frontend/src/hooks/useApprovalsState.js

// Mobile/Tablet/Desktop Shared Layout Logic 

import { useMemo, useCallback } from "react";
import { getApprovalKey } from "@/utils/helpers";

export function useApprovalsState({
  approvals = [],
  processedApprovals = [],
  selected = {},
  visibleCount = 0,
  hasScanned,
  loading,
  loadingTarget,
  isRefreshing,
  scanFailed,
  isEnriched,
  totalValueAtRisk,
  lastApproval,
  mostApproved,
  isDark,
  handleBatchRevoke = () => {},
  statusMap = {},
  TX_STATES = {},
  BATCH_KEY = null,
}) {
  const hasApprovals = approvals.length > 0;

  const isSkeletonLoading = 
    loading && 
    loadingTarget === "result" && 
    !isRefreshing;

  const isFetchErrorState = 
    scanFailed && 
    !hasApprovals;
  
  const showRefreshWarning = 
    scanFailed && 
    hasApprovals;
  
  const isEmptyState = 
    hasScanned && 
    !loading && 
    !hasApprovals && 
    !scanFailed;

  const isTotalApprovalsReady = isEnriched;

  const isValueReady = 
    isEnriched && 
    Number.isFinite(totalValueAtRisk);

  const isLastApprovalReady = 
    isEnriched && 
    lastApproval && 
    lastApproval.ageDisplay && 
    lastApproval.txHash;

  const invalidNames = [
    "unknown token", 
    "Unknown NFT", 
    "unknown", 
    "unk",
  ];

  const isMostApprovedReady = 
    isEnriched && 
    mostApproved && 
    mostApproved.assetAddress && 
    mostApproved.name && 
    !invalidNames.includes(mostApproved.name.toLowerCase());

  const primary = isDark ? "#9ca3af" : "#6b7280";

  const valueColor = totalValueAtRisk > 0 ? "#ef4444" : primary;

  const borderStyle = {
    border: isDark ? "1px solid #334155" : "1px solid #d1d5db",
    borderRadius: 10,
    marginTop: 10,
    padding: 12,
    justifyContent: "center",
  };

  const rows = useMemo(() => {
    return (
      processedApprovals || []
    ).slice(0, visibleCount);
  }, [
    processedApprovals,
    visibleCount,
  ]);

  const selectedApprovals = useMemo(() => {
    if (!processedApprovals.length) {
      return [];
    }

    return processedApprovals.filter((a) =>
      selected[getApprovalKey(a)]
    );

  }, [processedApprovals, selected]);

  const selectedCount = selectedApprovals.length;

  const hasProcessedApprovals = processedApprovals.length > 0;

  const handleBatchClick = useCallback(() => {
    if (selectedApprovals.length === 0) { 
      return;
    }

    handleBatchRevoke(selectedApprovals);

  }, [handleBatchRevoke, selectedApprovals]);

  const batch = statusMap[BATCH_KEY];

  const batchStatus = batch?.status;

  const batchProgress = batch?.progress;

  const isBatchBusy = 
    batchStatus === TX_STATES.SWITCHING || 
    batchStatus === TX_STATES.SIGNING || 
    batchStatus === TX_STATES.SUBMITTED;

  const isBatchLoading = isBatchBusy;

  const isBatchSuccess = batchStatus === TX_STATES.SUCCESS;

  return {
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
    selectedApprovals,
    selectedCount,
    hasProcessedApprovals,
    handleBatchClick,
    batch,
    batchStatus,
    batchProgress,
    isBatchBusy,
    isBatchLoading,
    isBatchSuccess,
  };
}