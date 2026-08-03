// frontend/src/components/layout/FetchErrorState.jsx

export default function FetchErrorState({
  isDark,
  error,
  onRetry,
  config,
}) {
  const {
    warningFontSize,
    headerFontSize,
    paragraphFontSize,
  } = config;
 
  return (
    <div
      style={{
        marginTop: 20,
        padding: "32px 24px",
        borderRadius: 20,
        textAlign: "center",
        background: isDark ? "#111827" : "#f8fafc",
        border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
      }}
    >
      <div
        style={{
          fontSize: warningFontSize,
          marginBottom: 16,
        }}
      >
        ⚠️
      </div>

      <h3
        style={{
          margin: 0,
          fontSize: headerFontSize,
          fontWeight: 700,
        }}
      >
        Unable to Scan Wallet
      </h3>

      <p
        style={{
          marginTop: 12,
          marginBottom: 24,
          opacity: 0.75,
          lineHeight: 1.6,
          fontSize: paragraphFontSize,
        }}
      >
        {error || "Something went wrong while fetching approvals. Please try again."}
      </p>

      <button
        onClick={onRetry}
        style={{
          border: "none",
          borderRadius: 12,
          padding: "12px 18px",
          fontWeight: 700,
          cursor: "pointer",
          background: "#3b82f6",
          color: "#fff",
        }}
      >
        Try Again
      </button>
    </div>
  );
}