// frontend/src/components/layout/SummaryCard.jsx

import { getExplorerUrl, truncateText } from "@/utils/helpers";

export default function SummaryCard({
  isDark,
  primary,
  valueColor,
  totalApprovals,
  totalValueAtRisk,
  lastApproval,
  mostApproved,
  isTotalApprovalsReady,
  isValueReady,
  isLastApprovalReady,
  isMostApprovedReady,
  selectedChain,
  CHAIN_EXPLORERS,
  setActiveModal,
  externalArrow,
  config,
}) {
  const {
    marginTop,
    padding,
    gridGap,
    labelFontSize,
    valueFontSize,
    valueMarginTop,
  } = config;
  
  function openLastApproval() {
    if (!isLastApprovalReady) {
      return;
    }
  
    const url = getExplorerUrl({
      type: "tx",
      value: lastApproval.txHash,
      chain: lastApproval.chain,
      selectedChain,
      CHAIN_EXPLORERS,
    });
  
    window.open(url, "_blank");
  }
  
  function openMostApproved() {
    if (!isMostApprovedReady) {
      return;
    }
  
    const url = getExplorerUrl({
      type: "token",
      value: mostApproved.assetAddress,
      chain: mostApproved.chain,
      selectedChain,
      CHAIN_EXPLORERS,
    });
  
    window.open(url, "_blank");
  } 
  
  return (
    <div
      style={{
        marginTop,
        padding,
        borderRadius: 14,
        background: isDark  ? "#1e293b" : "#f3f4f6",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: gridGap,
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {/* TOTAL APPROVALS */}
        <div>
          <div
            onClick={() => setActiveModal({type: "summaryApprovals"})}
            style={{
              fontSize: labelFontSize,
              cursor: "pointer",
            }}
          >
            Total Approvals
          </div>

          <div
            style={{
              fontSize: valueFontSize,
              fontWeight: isTotalApprovalsReady ? 700 : 600,
              marginTop: valueMarginTop,
              color: primary,
              opacity: isTotalApprovalsReady ? 1 : 0.5,
              transition: "opacity 0.2s ease",
            }}
          >
            {isTotalApprovalsReady ? totalApprovals : "—"}
          </div>
        </div>

        {/* VALUE AT RISK */}
        <div>
          <div
            onClick={() => setActiveModal({type: "summaryValue"})}
            style={{
              fontSize: labelFontSize,
              cursor: "pointer",
            }}
          >
            Value at Risk
          </div>
  
          <div
            style={{
              marginTop: valueMarginTop,
              fontSize: valueFontSize,
              color: valueColor,
              fontWeight: isValueReady ? 700 : 600,
              opacity: isValueReady ? 1 : 0.5,
              transition: "opacity 0.2s ease",
            }}
          >
            {isValueReady ? `$${(totalValueAtRisk || 0 ).toFixed(2)}` : "—"}
          </div>
        </div>
  
        {/* LAST APPROVAL */}
        <div>
          <div
            onClick={() => setActiveModal({type: "summaryLastApproval"})}
            style={{
              fontSize: labelFontSize,
              cursor: "pointer",
            }}
          >
            Last Approval
          </div>
  
          <div
            style={{
              fontSize: valueFontSize,
              fontWeight: 600,
              marginTop: valueMarginTop,
              color: primary,
              cursor: "pointer",
            }}
          >
            <div
              onClick={openLastApproval}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                cursor: isLastApprovalReady ? "pointer" : "default",
                opacity: isLastApprovalReady ? 1 : 0.5,
                transition: "opacity 0.2s ease",
              }}
            >
              {isLastApprovalReady ? `${lastApproval.ageDisplay} ago` : "—"}
              {isLastApprovalReady && externalArrow}
            </div>
          </div>
        </div>
  
        {/* MOST APPROVED */}
        <div>
          <div
            onClick={() => setActiveModal({
              type: "summaryMostApproved",
              data: mostApproved,
            })}
            style={{
              fontSize: labelFontSize,
              cursor: "pointer",
            }}
          >
            Most Approved
          </div>
  
          <div
            style={{
              fontSize: valueFontSize,
              fontWeight: 600,
              marginTop: valueMarginTop,
              color: primary,
              cursor: "pointer",
            }}
          >
            <div
              onClick={openMostApproved}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                cursor: isMostApprovedReady ? "pointer" : "default",
                opacity: isMostApprovedReady ? 1 : 0.5,
                transition: "opacity 0.2s ease",                 
              }}
            >
              {isMostApprovedReady ? truncateText(mostApproved.name, 6) : "—"}
              {isMostApprovedReady && externalArrow}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}