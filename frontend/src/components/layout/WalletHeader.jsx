// frontend/src/components/layout/WalletHeader.jsx

import { useCallback } from "react";

export default function WalletHeader({
  isDark,
  isConnectedView,
  statusLabel,
  addressLabel,
  activeAddress,
  addressCopied,
  setAddressCopied,
  connectSwitching,
  connectWallet,
  setShowDisconnectModal,
  config,
}) {
  const {
    dotSize,
    leftGap,
    leftMargin,
    labelGap,
    labelFontSize,
    addressFontSize,
    copyFontSize,
    buttonPadding,
    buttonRadius,
    iconSize,
    tooltipFontSize,
    rightOffset,
  } = config;
  
  const handleCopyAddress = useCallback(
    async () => {
      await navigator.clipboard.writeText(activeAddress);
  
      setAddressCopied(true);
  
      setTimeout(
        () => setAddressCopied(false),
        1500,
      );
    },

    [
      activeAddress,
      setAddressCopied,
    ],
  );
  
  const handleWalletAction = () => {
    if (isConnectedView) {
      setShowDisconnectModal(true);
      return;
    }
  
   connectWallet();
  };
  
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* LEFT SIDE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: leftGap,
          marginLeft: leftMargin,
        }}
      >
        <div
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: isConnectedView ? "#22c55e" : "#f59e0b",
            boxShadow: isConnectedView ? "0 0 8px #22c55e" : "0 0 8px #f59e0b",
          }}
        />

        <span
          style={{
            fontWeight: 500,
            fontSize: labelFontSize,
            display: "flex",
            alignItems: "center",
            gap: labelGap,
          }}
        >
          {statusLabel}:

          <span
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <span
              onClick={handleCopyAddress}
              style={{
                cursor: "pointer",
                fontWeight: 600,
                fontSize: addressFontSize,
              }}
            >
              {addressLabel}
            </span>

            <span
              style={{
                fontSize: copyFontSize,
                fontWeight: 600,
                color: "#22c55e",
                padding: "2px 6px",
                borderRadius: 6,
                opacity: addressCopied ? 1 : 0,
                transition: "all 0.2s ease",
              }}
            >
              ✓ Copied
            </span>
          </span>
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          right: rightOffset,
        }}
      >
        <button
          disabled={connectSwitching}
          onClick={handleWalletAction}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            boxShadow: "none",
            cursor: connectSwitching ? "not-allowed" : "pointer",
            padding: buttonPadding,
            borderRadius: buttonRadius,
            opacity: connectSwitching ? 0.6 : 1,
          }}
        >
          {connectSwitching ? (
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDark ? "#facc15" : "#b45309"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: "spin 1s linear infinite",
                transformOrigin: "center",
                display: "block",
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
          ) : isConnectedView ? (
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDark ? "#f87171" : "#dc2626"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          ) : (
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDark ? "#22c55e" : "#16a34a"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <path d="M7 6h10v3a5 5 0 0 1-10 0V6z" />
              <path d="M12 14v8" />
            </svg>
          )}
        </button>
  
        {connectSwitching && (
          <div
            style={{
              position: "absolute",
              top: "-100%",
              right: 0,
              background: isDark ? "#1e293b" : "#f3f4f6",
              color: isDark ? "#facc15" : "#b45309",
              padding: "6px 8px",
              fontSize: tooltipFontSize,
              borderRadius: 6,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              animation: "fadeInTooltip 0.2s ease",
              zIndex: 20,
            }}
          >
            Please confirm network switch in wallet...
          </div>
        )}
      </div>
    </div>
  );
}