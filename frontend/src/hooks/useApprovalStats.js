// frontend/src/hooks/useApprovalStats.js

import { useMemo } from "react";

const DEFAULT_WALLET_RISK = {
  score: 0,
  level: "Low",
  color: "#22c55e",
  label: "No Risk",
  action: "No active approvals",
  severity: "info",
  details: "No active approvals",
};

export function useApprovalStats({
  state,
}) {
  const {
    approvals,
    backendData,
  } = state;
 
  // -------------------------------------
  // WALLET RISK 
  // -------------------------------------
  
  const walletRisk = useMemo(() => 
    backendData?.walletRisk || DEFAULT_WALLET_RISK,
    [backendData]
  );
 
  // -------------------------------------
  // WALLET SUMMARY
  // ------------------------------------- 
 
  const totalApprovals = approvals.length;
  
  const totalValueAtRisk = useMemo(() => {
    const tokenMap = {};
    const nftMap = {};
  
    for (const item of approvals) {
      if (item.assetType === "nft") {
        const nftKey =
          item.approvalScope === "token"
            ? `${item.chain}-${item.assetAddress}-${item.tokenId}`
            : `${item.chain}-${item.assetAddress}`;
  
        nftMap[nftKey] = Math.max(
          nftMap[nftKey] || 0,
          Number(item.valueAtRisk || 0)
        );
  
        continue;
      }
  
      if (!item.balance || item.balance <= 0) {
        continue;
      }
  
      const key = `${item.chain}-${item.assetAddress}`.toLowerCase();
  
      if (!tokenMap[key]) {
        tokenMap[key] = {
          totalAllowance: 0,
          balance: item.balance || 0,
          price: item.price || 0,
        };
      }
  
      tokenMap[key].totalAllowance += Number(item.rawAmount || 0);
    }
  
    const tokenRisk = Object.values(tokenMap).reduce((sum, t) => {
      const exposure = Math.min(
        t.totalAllowance,
        t.balance
      );

      return sum + (exposure * t.price);
    }, 0);
  
    const nftRisk = Object.values(nftMap).reduce(
      (sum, value) => sum + value,
      0
    );
  
    return tokenRisk + nftRisk;

  }, [approvals]);

  const lastApproval = useMemo(() => {
    if (!approvals.length) return null;

    const valid = approvals.filter(a => a.txHash);

    if (!valid.length) return null;

    const newest = valid.reduce((min, a) => {
      if (!min) return a;
      return (a.daysOld || 0) < (min.daysOld || 0) ? a : min;
    }, null);

    if (!newest) return null;

    return {
     ageDisplay: newest.ageDisplay,
     txHash: newest.txHash,
     chain: newest.chain,
    };
  
  }, [approvals]); 

  const mostApproved = useMemo(() => {
    if (!approvals.length) return null;
  
    const map = approvals.reduce((acc, a) => {
      const rawKey = a.symbol || a.name || (a.assetType === "nft" ? "Unknown NFT" : "Unknown Token");
  
      const key = rawKey?.toUpperCase?.() || rawKey;
  
      const isUnknown = !key || key === "UNK" || key.startsWith("UNKNOWN");
  
      if (!acc[key]) {
        acc[key] = {
          name: key,
          count: 0,
          riskScore: 0,
          value: 0,
          type: a.assetType,
          isUnknown,
          assetAddress: a.assetAddress,
          chain: a.chain,
        };
      }
  
      acc[key].count += 1;
      acc[key].riskScore += a.riskScore || 0;
      acc[key].value += a.valueAtRisk || 0;
  
      return acc;
    }, {});
  
    const values = Object.values(map);
  
    const known = values.filter(v => !v.isUnknown);
  
    const listToSort = known.length ? known : values;
  
    return (
      listToSort
        .sort((A, B) => {
          if (B.count !== A.count) return B.count - A.count;
          if (B.riskScore !== A.riskScore) return B.riskScore - A.riskScore;
          if (B.value !== A.value) return B.value - A.value;
  
          if (A.type !== B.type) {
            return A.type === "token" ? -1 : 1;
          }
  
          return A.name.localeCompare(B.name);
        })[0] || null
    );
  }, [approvals]);
  
  return {
    walletRisk,
    totalApprovals,
    totalValueAtRisk,
    lastApproval,
    mostApproved,
  };
}