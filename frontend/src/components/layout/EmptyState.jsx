// frontend/src/components/layout/EmptyState.jsx

export default function EmptyState({
  isDark,
  isEmptyState,
  config,
}) {
  const {
    marginTop,
    padding,
    borderRadius,
    messageFontSize,
    illustrationSize,
  } = config;

  if (!isEmptyState) {
    return null;
  }

  return (
    <div
      style={{
        marginTop,
        padding,
        borderRadius,
        background: isDark ? "#1e293b" : "#f3f4f6",
        textAlign: "center",
      }}
    >
      <strong>
        Wallet Secure
      </strong>

      <p
        style={{ fontSize: messageFontSize }}
      >
        This wallet has no active ERC-20 approvals.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <svg
          width={illustrationSize}
          height={illustrationSize}
          viewBox="0 0 200 200"
          fill="none"
        >
          {/* Head */}
          <circle
            cx="100"
            cy="40"
            r="18"
            fill="#60a5fa"
          />

          {/* Body */}
          <ellipse
            cx="100"
            cy="105"
            rx="42"
            ry="48"
            fill="#60a5fa"
            opacity="0.35"
          />

          {/* Left Arm */}
          <path
            d="M75 90 L55 125"
            stroke="#60a5fa"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Right Arm */}
          <path
            d="M125 90 L145 120"
            stroke="#60a5fa"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Shield */}
          <path
            className="secure-shield"
            d="M100 88l14 6v14c0 14-7 24-14 28-7-4-14-14-14-28v-14l14-6z"
            stroke="#22c55e"
            strokeWidth="4"
            fill="rgba(34,197,94,0.15)"
          />

          {/* Checkmark */}
          <polyline
            points="92 108 98 114 108 100"
            stroke="#22c55e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}