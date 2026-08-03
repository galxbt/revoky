// frontend/src/components/approvals/ApprovalRow.jsx

// Tablet/Desktop Row 

import React from "react";
import { useApprovalRow } from "@/hooks/useApprovalRow";
import { useRowContext } from "@/context/hooks";
import { renderValue } from "@/utils/renderValue";
import { truncateText } from "@/utils/helpers";

import {
  formatBalance,
  formatValue,
  formatNftAllowance,
  formatDisplayAllowance,
} from "@/utils/formatters";

import { 
  CopyAddress,
  AssetLogo,
  AssetTypeBadge,
  AddressTypeBadge,
  ExplorerLink,
  RiskBadge,
  ChainLabel,
  RevokeButton,
  TxStatus,
} from "@/components/approvals";

const TABLE_GRID = `
  50px
  2.2fr
  2.5fr
  1.5fr
  2fr
  1.8fr
  1.8fr
  1.2fr
  1.2fr
  1.2fr
  minmax(60px, 70px)
`;

// -------------------------------------
// HEADER
// -------------------------------------

const ApprovalHeader = React.memo(
  function ApprovalHeader({isDark}) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: TABLE_GRID,
          padding: "12px 10px",
          columnGap: 12,
          fontWeight: 700,
          fontSize: 14,
          fontVariantNumeric: "tabular-nums",
          background: isDark ? "#1e293b" : "#f9fafb",
          position: "sticky",
          top: 0,
          zIndex: 5,
          boxSizing: "border-box",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }} />
        <div style={{ marginLeft: 10 }}>Asset</div>
        <div>Spender</div>
        <div>Type</div>
        <div>Allowance</div>
        <div>Balance</div>
        <div>Value</div>
        <div>Age</div>
        <div>Risk</div>
        <div>Tx</div>
        <div />
      </div>
    );
  }
);

// -------------------------------------
// ROWS
// -------------------------------------

const ApprovalRow = React.memo(
  function ApprovalRow({a}) {
    const row = useApprovalRow(a);
    const ctx = useRowContext();

    const openModal = (
      type,
      data = a,
    ) =>
      ctx.setActiveModal({
        type,
        data,
      });
  
    const explorerLinkStyle = { color: ctx.isDark ? "#60a5fa" : "#2563eb" };

    return (
      <div
        className="approval-row"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: TABLE_GRID,
          padding: "12px 10px",
          columnGap: 12,
          fontWeight: 500,
          fontSize: 14,
          fontVariantNumeric: "tabular-nums",
          alignItems: "center",
          borderTop: ctx.isDark
            ? "1px solid #334155"
            : "1px solid #e5e7eb",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {/* CHECKBOX */}
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {ctx.isConnectedView && ctx.selectedChain !== "all" && (
            <input
              type="checkbox"
              disabled={row.isBusy}
              checked={!!ctx.selected[row.itemKey]}
              onChange={row.toggleSelect}
              style={{ transform: "scale(1.3)", cursor: "pointer" }}
            />
          )}
        </div>

        {/* ASSET */}
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 10,
          }}
        >
          {/* Logo */}
          <AssetLogo
            logo={a.assetLogo}
            symbol={a.symbol}
            size={24}
          />

          {/* Wrapper */}
          <div 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              lineHeight: 1.1,
            }}
          >
            {/* Symbol */}
            <ExplorerLink
              type="token"
              value={a.assetAddress}
              chain={a.chain}
              selectedChain={ctx.selectedChain}
              CHAIN_EXPLORERS={ctx.CHAIN_EXPLORERS}
              style={explorerLinkStyle}
            >
              {truncateText( a.symbol || "—", 6)}
            </ExplorerLink>

            {/* Type */}
            <AssetTypeBadge
              assetType={a.assetType}
              isDark={ctx.isDark}
              variant="text"
              onClick={() => openModal("assetType")}
            />
 
            {/* Chain */} 
            {ctx.selectedChain === "all" && (
              <ChainLabel
                chain={a.chain}
                CHAINS={ctx.CHAINS}
                CHAIN_COLORS={ctx.CHAIN_COLORS}
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  fontWeight: 600,
                }}
              />
            )}
          </div>
        </div>
  
        {/* SPENDER */}
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8,
          }}
        >
          {/* Explorer Link */}
          <ExplorerLink
            type="address"
            value={a.spender}
            chain={a.chain}
            selectedChain={ctx.selectedChain}
            CHAIN_EXPLORERS={ctx.CHAIN_EXPLORERS}
            style={explorerLinkStyle}
          >
            {row.meta?.ownerLabel
              ? truncateText(row.meta.ownerLabel, 18)
              : ctx.truncateAddress(a.spender)
            }
          </ExplorerLink>
  
          {/* Copy */}
          <CopyAddress
            copied={ctx.copiedKey === row.itemKey}
            isDark={ctx.isDark}
            onClick={(e) => {
              e.stopPropagation();
              ctx.copyToClipboard(a.spender, row.itemKey);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              padding: 2,
            }}
          />
        </div>
  
        {/* ADDRESS TYPE */}
        <AddressTypeBadge
          variant="text"
          onClick={() => openModal("type")}
        >
          {renderValue(row.addressType)}
        </AddressTypeBadge>
  
        {/* ALLOWANCE */}
        <div
          onClick={() => {
            if (!a.isUnlimited) return;
            openModal("allowance")
          }}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: a.isUnlimited ? "pointer" : "default",
          }}
        >
          {renderValue(
            a.assetType === "nft"
              ? formatNftAllowance(a)
              : a.isUnlimited
              ? "Unlimited"
              : formatDisplayAllowance(row.formattedAllowance)
          )}
        </div>
  
        {/* BALANCE */}
        <div>
          {renderValue(formatBalance(a))}
        </div>
  
        {/* VALUE */}
        <div
          onClick={() => openModal("value")}
          style={{ cursor: "pointer" }}
        >
          {renderValue(formatValue(a.valueAtRisk))}
        </div>
  
        {/* AGE */}
        <div
          onClick={() => openModal("age")}
          style={{ 
            cursor: "pointer", 
            fontWeight: 500,
          }}
        >
          {renderValue(a.ageDisplay)}
        </div>
  
        {/* RISK */}
        <RiskBadge
          risk={a.risk}
          onClick={() => openModal("risk")}
        />
  
        {/* TX */}
        <div>
          {a.txHash && a.txHash !== "log_fallback" ? (
            <ExplorerLink
              type="tx"
              value={a.txHash}
              chain={a.chain}
              selectedChain={ctx.selectedChain}
              CHAIN_EXPLORERS={ctx.CHAIN_EXPLORERS}
              style={{
                color: "#3b82f6",
                fontSize: 13,
              }}
            >
              {ctx.truncateAddress(a.txHash, 3)}
            </ExplorerLink>
          ) : (
            "-"
          )}
        </div>
  
        {/* SINGLE REVOKE */}
        {ctx.isConnectedView && ctx.selectedChain !== "all" ? (
          <div 
            style={{ 
              display: "flex", 
              justifyContent: "center", 
            }}
          >
            <RevokeButton
              disabled={row.isBusy}
              loading={row.isLoading}
              onClick={row.handleSingleClick}
            />
          </div>
        ) : (
          <div />
        )}
  
        {/* SINGLE STATUS */}
        {row.status && (
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 25,
              zIndex: 20,
            }}
          >
            <TxStatus
              status={row.status}
              txUrl={row.txUrl}
              isDark={ctx.isDark}
              TX_STATES={ctx.TX_STATES}
              selectedChain={ctx.selectedChain}
              CHAIN_EXPLORERS={ctx.CHAIN_EXPLORERS}
              align="right"
            />
          </div>
        )}
      </div>
    );
  }
);

ApprovalRow.Header = ApprovalHeader;

export default ApprovalRow;