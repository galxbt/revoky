// frontend/src/hooks/useApprovalRow.js

// Mobile/Tablet/Desktop Shared Row Logic 

import { useMemo, useCallback } from "react";
import { useFlow } from "@/context/hooks";
import { getApprovalKey } from "@/utils/helpers";
import { formatAllowance } from "@/utils/formatters";

export function useApprovalRow(a) {
  const { 
    statusMap, 
    TX_STATES, 
    setSelected, 
    handleSingleRevoke, 
    addressMeta, 
  } = useFlow();

  const itemKey = useMemo(() => getApprovalKey(a), [a]);

  const statusData = statusMap[itemKey] || {};

  const status = statusData.status;
  const txUrl = statusData.txUrl;
  const txUrls = statusData.txUrls;

  const isBusy = 
    !!status && 
    status !== TX_STATES.SUCCESS;

  const isLoading = 
    status === TX_STATES.SWITCHING || 
    status === TX_STATES.SIGNING || 
    status === TX_STATES.SUBMITTED;

  const addressType = a.addressType;

  const spenderKey = a.spender?.toLowerCase?.() || "";

  const meta = addressMeta?.[spenderKey] || {
    ownerLabel: a.ownerLabel,
    isKnownProtocol: a.isKnownProtocol,
  };

  const formattedAllowance = formatAllowance(a);

  const handleSingleClick = useCallback(() => {
    handleSingleRevoke(a, itemKey);
  }, [handleSingleRevoke, a, itemKey]);

  const toggleSelect = useCallback(() => {
    setSelected(prev => {
      const updated = { ...prev };
      if (updated[itemKey]) delete updated[itemKey];
      else updated[itemKey] = true;
      return updated;
    });
  }, [setSelected, itemKey]);

  return {
    itemKey,
    status,
    txUrl,
    txUrls,
    isBusy,
    isLoading,
    addressType,
    meta,
    formattedAllowance,
    handleSingleClick,
    toggleSelect,
  };
}