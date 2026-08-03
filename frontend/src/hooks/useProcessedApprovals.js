// frontend/src/hooks/useProcessedApprovals.js

import { useMemo, useCallback } from "react";
import { getApprovalKey } from "../utils/helpers";

export function useProcessedApprovals({
  state,
  setters,
}) {
  const {
    approvals,
    selected,
    sortOption,
    sortMetric,
    sortDirection,
    searchQuery,
  } = state;
  
  const {
    setSelected,
  } = setters;
  
  // Apply filters, search, and sorting
  const processedApprovals = useMemo(() => {
    let list = [...approvals];
  
    if (sortOption === "token") {
      list = list.filter((a) => a.assetType === "token");
    }
  
    if (sortOption === "nft") {
      list = list.filter((a) => a.assetType === "nft");
    }
  
    if (searchQuery.trim()) {
      const query = searchQuery .trim() .toLowerCase();
  
      list = list.filter((a) => {
        return (
          a.name?.toLowerCase().includes(query) ||
          a.symbol?.toLowerCase().includes(query) ||
          a.assetAddress?.toLowerCase().includes(query) ||
          a.spender?.toLowerCase().includes(query) ||
          a.ownerLabel?.toLowerCase().includes(query)
        );
      });
    }
  
    list = list.map((a) => ({
      ...a,
  
      _sortValue:
        sortMetric === "value" ? a.valueAtRisk || 0
  
        : sortMetric === "age" ? a.daysOld || 0
  
        : sortMetric === "risk" ? (
          (a.risk === "High" ? 1000 : a.risk === "Medium" ? 500 : 0) + 
          (a.riskScore || 0) * 10 + 
          Math.log10((a.valueAtRisk || 0) + 1)
        )
  
        : sortMetric === "allowance" ? (() => {
          const TIER_APPROVAL_FOR_ALL = 2e15;

          const TIER_UNLIMITED = 1e15;

          if (a.approvalScope === "collection") {
            return TIER_APPROVAL_FOR_ALL;
          }

          if (a.isUnlimited) {
            return TIER_UNLIMITED;
          }

          if (a.assetType === "nft") {
            return Number(a.nftExposureUSD || 0);
          }

          return Number(a.tokenExposureUSD || 0);
        })()
  
      : 0,
    }));
  
    list.sort((a, b) => {
      if (sortMetric === "allowance") {
        if (sortDirection === "asc") {
          return (a._sortValue < b._sortValue ? -1 : 1);
        }
  
        return (a._sortValue > b._sortValue ? -1 : 1);
      }
  
      return sortDirection === "asc"
        ? a._sortValue - b._sortValue
        : b._sortValue - a._sortValue;
    });
  
    return list;
  
  }, [ 
    approvals, 
    sortOption, 
    sortMetric, 
    sortDirection, 
    searchQuery, 
  ]);
	
  // Filter approvals without applying search
  const filteredWithoutSearch = useMemo(() => {
    let list = [...approvals];
  
    if (sortOption === "token") {
      list = list.filter((a) => a.assetType === "token");
    }
  
    if (sortOption === "nft") {
      list = list.filter((a) => a.assetType === "nft");
    }
  
    return list;
  
  }, [approvals, sortOption]);
	
  // Count token approvals
  const tokenCount = useMemo(() => {
   return approvals.filter(a => a.assetType === "token").length;
  }, [approvals]);
  
  // Count NFT approvals
  const nftCount = useMemo(() => {
   return approvals.filter(a => a.assetType === "nft").length;
  }, [approvals]);
  
  // Get keys for the current filtered approvals
  const filteredKeys = useMemo(() =>
    processedApprovals.map(a => getApprovalKey(a)),
  [processedApprovals]);
	
  // Check if all filtered approvals are selected
  const allFilteredSelected = useMemo(() =>
    filteredKeys.length > 0 &&
    filteredKeys.every(key => selected[key]),
  [filteredKeys, selected]);
 
  // Toggle selection for all filtered approvals
  const handleSelectAll = useCallback(() => {
    if (!filteredKeys.length) return;
  
    setSelected(prev => {
      const updated = { ...prev };
  
      const allFilteredSelectedNow =
        filteredKeys.length > 0 &&
        filteredKeys.every(key => prev[key]);
  
      if (allFilteredSelectedNow) {
        filteredKeys.forEach(key => {
          delete updated[key];
        });
      } else {
        filteredKeys.forEach(key => {
          updated[key] = true;
        });
      }
  
      return updated;
    });
  }, [filteredKeys, setSelected]);
  
  return {
    processedApprovals,
    filteredWithoutSearch,
    tokenCount,
    nftCount,
    allFilteredSelected,
    handleSelectAll,
  };
}