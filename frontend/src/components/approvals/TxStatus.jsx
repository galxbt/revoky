// frontend/src/components/approvals/TxStatus.jsx

// Supports both single and batch revoke statuses

import React from "react";
import { isLowEnd } from "@/utils/device";

const TxStatus = React.memo(
  function TxStatus({
    status,
    txUrl,
    txUrls,
    walletAddress,
    selectedChain,
    CHAIN_EXPLORERS,
    setTxModal,
    isDark,
    TX_STATES,
    align = "center",
    progress,
    isBatch = false,
    screen,
  }) {
    if (!status) return null;
  
    const isMobile = screen === "mobile";
  
    const baseStyle = {
      fontSize: isMobile ? 12 : 14,
      padding: isMobile ? "8px 10px" : "10px 12px",
      borderRadius: 10,
      background: isDark ? "#1e293b" : "#f3f4f6",
      fontWeight: 500,
      textAlign: "center",
      whiteSpace: "nowrap",
    };
  
    const wrapperStyle = align === "right"
      ? {
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 6,
        }
      : {
          display: "flex",
          justifyContent: "center",
          marginTop: 6,
        };
  
    const statusMessages = {
      [TX_STATES.SWITCHING]:
        "Please confirm network switch in wallet...",
  
      [TX_STATES.SIGNING]:
        progress
          ? `Confirm transaction ${progress.current}/${progress.total} in wallet...`
          : "Confirm transaction in wallet...",
  
      [TX_STATES.SUBMITTED]:
        progress
          ? `Transaction submitted (${progress.current}/${progress.total})`
          : "Transaction submitted...",
    };
  
    const content = statusMessages[status];
  
    const isSuccess = status === TX_STATES.SUCCESS;
  
    return (
      <div style={wrapperStyle}>
        {/* SUCCESS STATE */}
        {isSuccess && (
          <div
            style={{
              ...baseStyle,
              minWidth: isMobile ? 150 : 180,
              animation: isLowEnd ? "none" : "successPop 0.35s ease",
            }}
          >
            {/* Only show success text for single */}
            {!isBatch && (
              <div
                style={{
                  color: "#22c55e",
                  fontWeight: 600,
                }}
              >
                Revoke Successful!
              </div>
            )}
  
            {/* Show link for both single + batch */}
            {(txUrls?.length || txUrl) && (
              <div
                onClick={() => {
                  const count = txUrls?.length || 0;
  
                  const explorer = selectedChain === "all"
                    ? "https://blockscan.com"
                    : CHAIN_EXPLORERS[selectedChain];
  
                  // Many → open wallet
                  if (count > 10 && walletAddress) {
                    window.open(`${explorer}/address/${walletAddress}`, "_blank");
                    return;
                  }
  
                  // Multiple → open modal
                  if (count > 1) {
                    setTxModal?.({
                      txUrls,
                      chain: selectedChain,
                    });
                    return;
                  }
  
                  // Single
                  window.open(txUrls?.[0] || txUrl, "_blank");
                }}
                style={{
                  marginTop: isBatch ? 0 : 4,
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "#3b82f6",
                  fontWeight: 500,
                }}
              >
                {txUrls?.length > 10
                  ? "View all on explorer"
                  : txUrls?.length > 1
                  ? `View transactions (${txUrls.length})`
                  : "View transaction"}
              </div>
            )}
          </div>
        )}
  
        {/* NON-SUCCESS STATES */}
        {!isSuccess && content && (
          <p
            style={{
              ...baseStyle,
              color: status === TX_STATES.SUBMITTED
                ? isDark ? "#60a5fa" : "#2563eb"
                : isDark ? "#facc15" : "#b45309",
            }}
          >
            {content}
          </p>
        )}
      </div>
    );
  }
); 

export default TxStatus;