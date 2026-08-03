// frontend/src/components/layout/ScanInput.jsx

import { safeMap } from "@/utils/list";

export default function ScanInput({
  isDark,
  scanAddress,
  setScanAddress,
  showRecent,
  setShowRecent,
  filteredRecentWallets,
  clearRecentWallets,
  removeRecentWallet,
  handleScan,
  truncateAddress,
  config,
}) {
  const {
    inputPadding,
    inputFontSize,
    clipboardIconSize,
    headerFontSize,
    connectedBadgeFontSize,
    secondaryTextFontSize,
    deleteIconSize,
  } = config;

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setScanAddress(text);
    } catch {
      alert("Clipboard access denied");
    }
  }

  function handleInputBlur() {
    setTimeout(
      () => setShowRecent(false),
      150,
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <input
        value={scanAddress}
        onChange={(e) => setScanAddress(e.target.value)}
        onFocus={() => setShowRecent(true)}
        onBlur={handleInputBlur}
        placeholder="Enter wallet address or ENS"
        style={{
          width: "100%",
          padding: inputPadding,
          borderRadius: 16,
          border: isDark ? "1px solid #334155" : "1px solid #d1d5db",
          fontSize: inputFontSize,
          outline: "none",
          boxSizing: "border-box",
          background: isDark ? "#1e293b" : "#f9fafb",
          color: isDark ? "#f1f5f9" : "#111111",
        }}
      />

      {/* PASTE ADDRESS */}
      {!scanAddress && (
        <button
          onClick={handlePaste}
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.7,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={clipboardIconSize}
            height={clipboardIconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDark ? "#9ca3af" : "#6b7280"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect
              x="9"
              y="3"
              width="6"
              height="4"
              rx="1.5"
            />
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          </svg>
        </button>
      )}

      {/* RECENT WALLET DROPDOWN */}
      {showRecent && filteredRecentWallets.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            marginTop: 6,
            borderRadius: 14,
            background: isDark ? "#1e293b" : "#ffffff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)", 
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              fontSize: headerFontSize,
              fontWeight: 600,
              opacity: 0.7,
              borderBottom: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
            }}
          >
            <span>Recent</span>

            <span
              onClick={clearRecentWallets}
              style={{
                cursor: "pointer",
                color: "#ef4444",
                fontWeight: 600,
              }}
            >
              Clear
            </span>
          </div>

          {/* List */}
          {safeMap(
            filteredRecentWallets,
            (item, key, i) => {
              const primaryLabel =
                item.ens ||
                (item.input?.endsWith(".eth") ? item.input : null) ||
                truncateAddress(item.resolved);

              return (
                <div
                  key={key}
                  style={{
                    padding: "12px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: i !== filteredRecentWallets.length - 1
                      ? isDark ? "1px solid #334155" : "1px solid #e5e7eb" : "none",
                  }}
                >
                  {/* Click Area */}
                  <div
                    onClick={() => {
                      if (item.isSuggested) {
                        const value = item.input?.endsWith(".eth")
                          ? item.input : item.resolved;
                        setScanAddress(value);
                        handleScan(item.resolved);
                      } else {
                        setScanAddress(item.input || item.resolved);
                      }

                      setShowRecent(false);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {primaryLabel}

                      {item.isSuggested && (
                        <span
                          style={{
                            fontSize: connectedBadgeFontSize,
                            background: "#3b82f6",
                            color: "#fff",
                            padding: "2px 6px",
                            borderRadius: 6,
                            marginLeft: 6,
                          }}
                        >
                          Connected
                        </span>
                      )}
                    </span>

                    {item.ens && (
                      <span
                        style={{
                          fontSize: secondaryTextFontSize, 
                          opacity: 0.6,
                        }}
                      >
                        {truncateAddress(item.resolved)}
                      </span>
                    )}
                  </div>

                  {/* Delete Button */}
                  {!item.isSuggested && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentWallet(item.resolved);
                      }}
                      style={{
                        marginLeft: 10,
                        cursor: "pointer",
                        opacity: 0.6,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={deleteIconSize}
                        height={deleteIconSize}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={isDark ? "#94a3b8" : "#6b7280"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line
                          x1="18"
                          y1="6"
                          x2="6"
                          y2="18"
                        />
                        <line
                          x1="6"
                          y1="6"
                          x2="18"
                          y2="18"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}