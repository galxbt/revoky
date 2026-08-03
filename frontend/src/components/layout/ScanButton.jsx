// frontend/src/components/layout/ScanButton.jsx

export default function ScanButton({
  isDark,
  scanAddress,
  loading,
  handleScan,
  config,
}) {
  const {
    marginTop,
    padding,
    fontSize,
    iconSize,
  } = config;

  const disabled = !scanAddress.trim() || loading;

  return (
    <button
      onClick={() => handleScan(scanAddress)}
      disabled={disabled}
      style={{
        width: "100%",
        marginTop,
        padding,
        borderRadius: 14,
        background: disabled ? "#9ca3af" : isDark ? "#374151" : "#e5e7eb",
        color: isDark ? "#f9fafb" : "#111827",
        border: "none",
        fontWeight: 600,
        fontSize,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
          />
          <line
            x1="21"
            y1="21"
            x2="16.65"
            y2="16.65"
          />
        </svg>

        <span>
          {loading ? "Scanning..." : "Scan Wallet"}
        </span>
      </div>
    </button>
  );
}