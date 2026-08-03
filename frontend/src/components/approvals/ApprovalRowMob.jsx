// frontend/src/components/approvals/ApprovalRowMob.jsx

// Mobile Row 

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

// -------------------------------------
// ROWS
// -------------------------------------

const ApprovalRow = React.memo(
  function ApprovalRow({
    a,
    cardLayout,
  }) {
    const row = useApprovalRow(a);
    const ctx = useRowContext();
  
    if (cardLayout === "grid") {
      return (
        <GridView 
          a={a}
          ctx={ctx}
          row={row}
        />
      );
    }
  
    return (
      <VerticalView
        a={a}
        ctx={ctx}
        row={row}
      />
    );
  }
);

// -------------------------------------
// VERTICAL VIEW
// -------------------------------------

const VerticalView = React.memo(
  function VerticalView({
    a,
    ctx,
    row,
  }) {
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
        style={{
          marginTop: 12,
          position: "relative",
          padding: "12px 0 12px 24px",
          borderRadius: 12,
          background: ctx.isDark ? "#1e293b" : "#f3f4f6",
          fontSize: 15,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {/* CHECKBOX */}
          {ctx.selectedChain !== "all" && ctx.isConnectedView && (
            <input
              type="checkbox"
              disabled={row.isBusy}
              checked={!!ctx.selected[row.itemKey]}
              onChange={row.toggleSelect}
            />
          )}
  
          {/* LOGO */}
          <AssetLogo
            logo={a.assetLogo}
            symbol={a.symbol}
            size={28}
          />
  
          {/* ASSET */}
          <ExplorerLink
            type="token"
            value={a.assetAddress}
            chain={a.chain}
            selectedChain={ctx.selectedChain}
            CHAIN_EXPLORERS={ctx.CHAIN_EXPLORERS}
            style={explorerLinkStyle}
          >
            {`${truncateText(a.name || "—", 10)} (${truncateText(a.symbol || "—", 6)})`}
          </ExplorerLink>
  
          {/* TYPE */}
          <AssetTypeBadge
            assetType={a.assetType}
            isDark={ctx.isDark}
            onClick={() => openModal("assetType")}
            style={{marginLeft: 6}}
          />
        </div>
  
        {/* SPENDER */}
        <div
          style={{
            marginTop: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
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
  
            {/* Address Type */}
            <AddressTypeBadge
              onClick={() => openModal("type")}
            >
              {renderValue(row.addressType)}
            </AddressTypeBadge>

            {/* Copy */}
            <CopyAddress
              copied={ctx.copiedKey === row.itemKey}
              isDark={ctx.isDark}
              onClick={() => ctx.copyToClipboard(a.spender, row.itemKey)}
            />
          </div>
        </div>
  
        {/* CORE */}
        <div style={{ marginTop: 2 }}>
          <div>
            {/* ALLOWANCE */}
            <p style={{ margin: 0 }}>
              <strong>Allowance:</strong>{" "}
  
              <span
                onClick={() => {
                  if (!a.isUnlimited) {
                    return;
                  }
                  openModal("allowance")
                }}
                style={{ cursor: a.isUnlimited ? "pointer" : "default" }}
              >
                {renderValue(
                  a.assetType === "nft"
                    ? formatNftAllowance(a)
                    : a.isUnlimited
                    ? "Unlimited"
                    : formatDisplayAllowance(row.formattedAllowance)
                )}
              </span>
            </p>
  
            {/* BALANCE */}
            <p style={{ margin: 0 }}>
              <strong>Balance:</strong>{" "}
              {renderValue(formatBalance(a))}
            </p>
  
            {/* VALUE */}
            <p style={{ margin: 0 }}>
              <strong>Value at Risk:</strong>{" "}
              <span
                onClick={() => openModal("value")}
                style={{ cursor: "pointer" }}     
              >
                {renderValue(formatValue(a.valueAtRisk))}
              </span>
            </p>
          </div>
  
          {/* DIVIDER */}
          <div
            style={{
              height: 1,
              background: ctx.isDark ? "#334155" : "#e5e7eb",
              margin: "2px 0",
            }}
          />
  
          {/* META */}
          <div>
  
            {/* AGE */}
            <p style={{ margin: 0 }}>
              <strong> Approval Age: </strong>{" "}
              <span
                onClick={() => openModal("age")}
                style={{ cursor: "pointer" }}
              >
                {renderValue(a.ageDisplay)}
              </span>
            </p>
  
            {/* TX */}
            <p style={{ margin: 0 }}>
              <strong>Tx Hash:</strong>{" "}
  
              {a.txHash && a.txHash !== "log_fallback" ? (
                <ExplorerLink
                  type="tx"
                  value={a.txHash}
                  chain={a.chain}
                  selectedChain={ctx.selectedChain}
                  CHAIN_EXPLORERS={ctx.CHAIN_EXPLORERS}
                  style={{ color: "#3b82f6" }}
                >
                  {ctx.truncateAddress(a.txHash, 3)}
                </ExplorerLink>
              ) : (
                "-"
              )}
            </p>
  
            {/* RISK */}
            <p style={{ margin: 0 }}>
              <strong> Risk Level: </strong>{" "}
              <RiskBadge
                risk={a.risk}
                onClick={() => openModal("risk")}
              />
            </p>
  
            {/* CHAIN */}
            {ctx.selectedChain === "all" && (
              <p style={{ margin: 0 }}>
                <strong>Chain:</strong>{" "}
                <ChainLabel
                  chain={a.chain}
                  CHAINS={ctx.CHAINS}
                  CHAIN_COLORS={ctx.CHAIN_COLORS}
                  style={{fontWeight: 700}}
                />
              </p>
            )}
          </div>
        </div>
  
        {/* SINGLE REVOKE */}
        {ctx.isConnectedView && ctx.selectedChain !== "all" && (
          <div
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <RevokeButton
              disabled={row.isBusy}
              loading={row.isLoading}
              onClick={row.handleSingleClick}
              size={34}
            />
          </div>
        )}
  
        {/* SINGLE STATUS */}
        {row.status && (
          <div
            style={{
              position: "absolute",
              top: 120,
              right: 0,
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
              screen="mobile"
            />
          </div>
        )}
      </div>
    );
  }
);

// Grid Header Style 
const GRID_HEADER_STYLE = {
  fontWeight: 700,
  fontSize: 11,
};

// -------------------------------------
// GRID VIEW
// -------------------------------------

const GridView = React.memo(
  function GridView({ 
    a, 
    ctx, 
    row,
  }) {
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
        style={{
          marginTop: 12,
          position: "relative",
          display: "flex",
          minWidth: 680,
          backgroundClip: "padding-box",
          borderRadius: 12,
          background: ctx.isDark ? "#1e293b" : "#f3f4f6",
          padding: "10px 12px",
          alignItems: "center",
          gap: 16,
          whiteSpace: "nowrap",
        }}
      >
        {/* CHECKBOX */}
        {ctx.selectedChain !== "all" && ctx.isConnectedView && (
          <input
            type="checkbox"
            disabled={row.isBusy}
            checked={!!ctx.selected[row.itemKey]}
            onChange={row.toggleSelect}
          />
        )}
  
        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(170px,1.4fr) 1.3fr 0.9fr 1fr",
            rowGap: 6,
            fontSize: 13,
          }}
        >
          {/* ROW 1 HEADERS */}
          <div style={GRID_HEADER_STYLE}>
            Spender
          </div>

          <div style={GRID_HEADER_STYLE}>
            Type
          </div>

          <div style={GRID_HEADER_STYLE}>
            Age
          </div>

          <div style={GRID_HEADER_STYLE}>
            Tx
          </div>
  
          {/* SPENDER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
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
              onClick={() => ctx.copyToClipboard(a.spender, row.itemKey)}
            />
          </div>
  
          {/* ADDRESS TYPE */}
          <div>
            <AddressTypeBadge
              onClick={() => openModal("type")}
            >
              {renderValue(row.addressType)}
            </AddressTypeBadge>
          </div>
  
          {/* AGE */}
          <div>
            <span
              onClick={() => openModal("age")}
              style={{ cursor: "pointer" }}
            >
              {renderValue(a.ageDisplay)}
            </span>
          </div>
  
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
                  fontSize: 11,
                }}
              >
                {ctx.truncateAddress(a.txHash, 3)}
              </ExplorerLink>
            ) : (
              "-"
            )}
          </div>
  
          {/* ROW 2 HEADERS */}
          <div style={GRID_HEADER_STYLE}>
            Asset
          </div>

          <div style={GRID_HEADER_STYLE}>
            Allowance
          </div>

          <div style={GRID_HEADER_STYLE}>
            Balance
          </div>

          <div style={GRID_HEADER_STYLE}>
            Value
          </div>
  
          {/* ASSET */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {/* Logo */}
            <AssetLogo
              logo={a.assetLogo}
              symbol={a.symbol}
              size={20}
            />
  
            {/* Symbol */}
            <ExplorerLink
              type="token"
              value={a.assetAddress}
              chain={a.chain}
              selectedChain={ctx.selectedChain}
              CHAIN_EXPLORERS={ctx.CHAIN_EXPLORERS}
              style={explorerLinkStyle}
            >
              {truncateText(a.symbol || "—", 6)}
            </ExplorerLink>
  
            {/* Type */}
            <AssetTypeBadge
              assetType={a.assetType}
              isDark={ctx.isDark}
              onClick={() => openModal("assetType")}
            />
          </div>
  
          {/* ALLOWANCE */}
          <div
            onClick={() => {
              if (!a.isUnlimited) {
                return;
              }
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
        </div>
  
        {/* RIGHT SIDE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* RISK */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Risk
            </div>
  
            <RiskBadge
              risk={a.risk}
              onClick={() => openModal("risk")}
              style={{ fontSize: 13 }}
            />
          </div>
  
          {/* CHAIN */}
          {ctx.selectedChain === "all" && (
            <ChainLabel
              chain={a.chain}
              CHAINS={ctx.CHAINS}
              CHAIN_COLORS={ctx.CHAIN_COLORS}
              style={{
                fontSize: 12,
                fontWeight: 600,
              }}
            />
          )}
  
          {/* SINGLE REVOKE */}
          {ctx.isConnectedView && ctx.selectedChain !== "all" && (
            <RevokeButton
              disabled={row.isBusy}
              loading={row.isLoading}
              onClick={row.handleSingleClick}
              size={32}
            />
          )}
        </div>
  
        {/* SINGLE STATUS */}
        {row.status && (
          <div
            style={{
              position: "absolute",
              top: 60,
              right: 0,
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
              screen="mobile"
            />
          </div>
        )}
      </div>
    );
  }
);

export default ApprovalRow;