// frontend/src/components/layout/AccountMeta.jsx

export default function AccountMeta({
  isDark,
  isEnriched,
  accountInfo,
  walletRisk,
  setActiveModal,
  showQuickLinks,
  setShowQuickLinks,
  config,
}) {
  const {
    gap,
    marginLeft,
    labelFontSize,
    valueFontSize,
    riskFontSize,
    showToggle,
  } = config;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap,
        marginLeft,
        flexWrap: "wrap",
      }}
    >
      {/* ACCOUNT TYPE */}
      <span
        style={{
          fontSize: labelFontSize,
          fontWeight: 600,
          color: isDark ? "#ffffff" : "#4c4c4c",
          cursor: "pointer",
        }}
      >
        Account Type:
      </span>

      <span
        onClick={() =>
          isEnriched &&
          accountInfo &&
          setActiveModal({
            type: "accountType",
            data: accountInfo,
          })
        }
        style={{
          fontSize: valueFontSize,
          fontWeight: 600,
          color: "#64748b",
          cursor: isEnriched ? "pointer" : "default",
          opacity: isEnriched  ? 1 : 0.5,
          transition: "opacity 0.2s ease",
        }}
      >
        {!isEnriched ? "—" : accountInfo?.type || "—"}
      </span>

      {/* RISK SCORE */}
      <span
        style={{
          fontSize: labelFontSize,
          fontWeight: 600,
          color: isDark 
            ? "#ffffff" 
            : "#4c4c4c",
          marginLeft: 6,
        }}
      >
        Risk Score:
      </span>

      <span
        onClick={() =>
          isEnriched &&
          setActiveModal({
            type: "walletRisk",
            data: walletRisk,
          })
        }
        style={{
          fontSize: riskFontSize,
          fontWeight: 700,
          cursor: isEnriched  ? "pointer" : "default",
          color: isEnriched ? walletRisk.color : "#94a3b8",
          opacity: isEnriched  ? 1 : 0.5,
          transition: "opacity 0.2s ease, color 0.2s ease",
        }}
      >
        {!isEnriched ? "—" : walletRisk?.score ?? "—"}
      </span>

      {/* TOGGLE */}
      {showToggle && (
        <div
          onClick={() => setShowQuickLinks(prev => !prev)}
          style={{
            marginLeft: 6,
            padding: 6,
            borderRadius: 20,
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDark ? "#cbd5e1" : "#374151"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: showQuickLinks ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s ease",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      )}
    </div>
  );
}