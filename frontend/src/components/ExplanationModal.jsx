// frontend/src/components/ExplanationModal.jsx  

import React from "react";
import { CHAIN_EXPLORERS } from "@/config/chainMeta";

export default function ExplanationModal({
  modal,
  isDark,
  onClose,
  approvals,
  selectedChain,
}) {
  if (!modal) return null;

  const { type } = modal;
  
  const data = modal.data || modal.approval;

  const titleColor =
    type === "risk"
      ? data?.risk === "High"
        ? "#ef4444"
        : data?.risk === "Medium"
        ? "#f59e0b"
        : "#22c55e"
    : undefined;
 
  return (
    <div
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "92%",
          maxWidth: 420,
          borderRadius: 16,
          background: isDark  ? "#0f172a" : "#ffffff",
          padding: 24,
        }}
      >
        {/* TITLE */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 14,
            color: titleColor,
          }}
        >
          {type === "accountType" && "Account Type"}

          {type === "walletRisk" && "Wallet Risk"}
          
          {type === "summaryApprovals" && "Total Approvals"}
          {type === "summaryValue" && "Value at Risk"}
          {type === "summaryLastApproval" && "Last Approval"}
          {type === "summaryMostApproved" && "Most Approved"}

          {type === "assetType" && "Asset Type"}
          {type === "type" && "Address Type"}

          {type === "allowance" && (
            data.assetType === "nft"
              ? "Collection Approval"
              : "Unlimited Approval"
          )}

          {type === "value" && "Value At Risk"}
          {type === "age" && "Approval Age"}
          {type === "risk" && `${data.risk} Risk Approval`}           
        </div>
 
        {/* BODY */}
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: isDark  ? "#cbd5e1" : "#374151",
          }}
        >
          {type === "accountType" && (
            <>
              <strong>{data.type}</strong>
              {data.subType && <> ({data.subType})</>}

              {/* Delegation info */}
              {data.isDelegated && data.executorLabel && (
                <>
                  <br /><br />
                  <strong>Delegated to:</strong>{" "}
                  <span
                    style={{
                      color: "#3b82f6",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const chainKey = selectedChain || "ethereum";
                      const base = CHAIN_EXPLORERS[chainKey];

                      if (!base || !data.delegateAddress) return;

                      window.open(`${base}/address/${data.delegateAddress}`, "_blank");
                    }}
                  >
                    {data.executorLabel.replace(" (EIP-7702)", "")}
                  </span>
                </>
              )}

              <br /><br />

              {data.explanation}
            </>
          )}           

          {type === "walletRisk" && (
            <>
              <strong style={{ color: data.color }}>
                {data.label}
              </strong>

              <br /><br />

              Risk Score: {data.score} / 100

              <br /><br />

              This score reflects your exposure, risk severity, and approval patterns.

              <br /><br />

              {data.details && (
                <>
                  Breakdown: {data.details}
                  <br /><br />
                </>
              )}

              {/* Action Guidance */}
              {data.action && (
                <>
                  <strong>Recommended Action:</strong> {data.action}
                  <br /><br />
                </>
              )}

              {/* Severity Messaging */}
              {data.level === "Severe" && (
                <>
                  🚨 Your wallet is in a severe state. Immediate action required to prevent potential asset loss.
                </>
              )}

              {data.level === "High" && (
                <>
                  ⚠️ High-risk exposure detected. Malicious or overly permissive approvals may exist.
                </>
              )}

              {data.level === "Elevated" && (
                <>
                  ⚠️ Risk is building up. Multiple approvals may increase your exposure over time.
                </>
              )}

              {data.level === "Moderate" && (
                <>
                  👉 Some exposure detected. Regular cleanup helps maintain security.
                </>
              )}

              {data.level === "Minimal" && (
                <>
                  ✅ Your wallet is in a healthy state. Maintain periodic reviews to stay safe.
                </>
              )}
            </>
          )}
        </div>

        {type === "summaryApprovals" && 
          "This represents the total number of active token and nft approvals granted by this wallet across the selected chain(s)."}

        {type === "summaryValue" &&
          "This is the combined USD value that could potentially be transferred if all approved spenders used their full allowance."}

        {type === "summaryLastApproval" &&
          "This shows how recently the newest asset approval was granted to a spender contract or wallet."}

        {type === "summaryMostApproved" && data && (() => {
          // Rebuild grouped list (same logic as ranking)
            const grouped = Object.values(
              (approvals || []).reduce((acc, a) => {
                const key =
                  a.symbol ||
                  a.name ||
                  (a.assetType === "nft" ? "Unknown NFT" : "Unknown Token");

                  if (!acc[key]) {
                    acc[key] = {
                      name: key,
                      count: 0,
                      riskScore: 0,
                      value: 0,
                      type: a.assetType,
                      isUnknown: key.startsWith("Unknown"),
                      assetAddress: a.assetAddress,
                      chain: a.chain,
                    };
                  }
 
                  acc[key].count += 1;
                  acc[key].riskScore += a.riskScore || 0;
                  acc[key].value += a.valueAtRisk || 0;
 
                  return acc;
              }, {})
            );

            // Sort using same logic
            const sorted = grouped.sort((A, B) => {
              if (A.isUnknown !== B.isUnknown) {
                return A.isUnknown ? 1 : -1;
              }

              if (B.count !== A.count) return B.count - A.count;

              if (B.riskScore !== A.riskScore) return B.riskScore - A.riskScore;
 
              if (B.value !== A.value) return B.value - A.value;

              if (A.type !== B.type) {
                return A.type === "token" ? -1 : 1;
              }

              return A.name.localeCompare(B.name);
            });

            const top = sorted[0];
            const runnerUp = sorted[1];

            // Detect if tie exists (only then we explain)
            const isTie = runnerUp && top.count === runnerUp.count;

            const reasons = [];

            if (isTie && runnerUp) {
              if (top.riskScore !== runnerUp.riskScore) {
                reasons.push("Higher cumulative risk score");
              } 
              else if (top.value !== runnerUp.value) {
                reasons.push("Higher value at risk");
              }
              else if (top.type !== runnerUp.type) {
                if (top.type === "token") {
                  reasons.push("Token prioritized over NFT");
                }
              }
              else if (top.name !== runnerUp.name) {
                reasons.push("Alphabetical order");
              }

              if (top.isUnknown !== runnerUp.isUnknown && !top.isUnknown) {
                 reasons.push("Unknown assets ranked lowest");
              }
            }

            return (
              <>
                This asset has the highest number of active approvals granted to different spenders.
                <br /><br />

                <strong>{data.name}</strong>: {data.count} approval{data.count > 1 ? "s" : ""}

                {/* Only show tie-break info if tie actually exists */}
                {isTie && (
                <>
                  {/* Show only relevant metrics */}
                  {reasons.includes("Higher cumulative risk score") && (
                    <>
                      <br />
                      Total risk score: {data.riskScore}
                    </>
                  )}

                  {reasons.includes("Higher value at risk") && data.value > 0 && (
                    <>
                      <br />
                      Value at risk: ${data.value.toFixed(2)}
                    </>
                  )}

                  {reasons.length > 0 && (
                    <>
                      <br /><br />
                      <span style={{ opacity: 0.8 }}>
                        Ranked higher than <strong>{runnerUp.name}</strong> due to:{" "}
                        {reasons.join(", ")}.
                      </span>
                    </>
                  )}
                </>
              )}
            </>
          );
        })()}

        {type === "assetType" && (
          <>
            <strong>{data.assetStandard}</strong>
        
            <br /><br />
        
            {data.assetStandard === "ERC-20" && (
              <>
                ERC-20 is the standard for fungible tokens.
                Tokens are interchangeable and each unit has equal value.
              </>
            )}
        
            {data.assetStandard === "ERC-721" && (
              <>
                ERC-721 is the standard for unique NFTs.
                Each token ID represents a single unique asset.
              </>
            )}
        
            {data.assetStandard === "ERC-1155" && (
              <>
                ERC-1155 is a multi-token standard.
                A single contract can manage fungible, non-fungible, and semi-fungible assets.
              </>
            )}
        
            {data.assetStandard === "Unknown" && (
              <>
                The NFT standard couldn't be determined.
              </>
            )}
          </>
        )}
 
        {type === "type" && 
          (data.addressType === "EOA"
            ? "This is a standard wallet controlled by a private key."

            : data.addressType === "Smart Wallet"
              ? "This is an advanced smart wallet with programmable execution logic."

              : "This is a deployed smart contract controlled by on-chain logic."
        )}

        {type === "allowance" && 
          (data.assetType === "nft"
            ? (
              <>
                {data.approvalScope === "collection"
                  ? (
                    <>
                      This approval allows the spender to transfer
                      <strong> all NFTs </strong>
                      from this collection without asking for confirmation again.
                      <br /><br />
                      If the spender becomes compromised or malicious, every NFT in this collection could potentially be moved.
                    </>
                  ) : null
                }
              </>
            ) : (
              <>
                This approval allows the spender to use your tokens without requiring another wallet confirmation.
                <br /><br />
                The spender can transfer up to your available balance at any time until the approval is revoked.
              </>
            )
          )
        }
 
        {type === "value" &&
          "This is the estimated maximum value based on your balance that could be transferred if the spender uses the full allowance."}

        {type === "age" &&
          "This shows how long the approval was granted on-chain."}
 
        {type === "risk" && (
          <div>
            {(data.riskExplanation || []).map((line, i) => (
              <div
                key={i}
                style={{ marginBottom: 8 }}
              >
                {line}
              </div>
            ))}
          </div>
        )} 
 
        {/* CLOSE BUTTON */}
        <div 
          style={{ 
            marginTop: 20, 
            textAlign: "right",
          }}>
          <button
            onClick={(e) => {
            e.preventDefault();      
            e.stopPropagation();
            onClose();
            }}
            style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            background: "#3b82f6",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            }}
            >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}