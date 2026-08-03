// frontend/src/components/approvals/CopyAddress.jsx

import React from "react";

const CopyAddress = React.memo(
  function CopyAddress({
    copied,
    isDark,
    onClick,
    style,
  }) {
    return (
      <span
        onClick={onClick}
        style={{
          cursor: "pointer",
          ...style,
        }}
      >
        {copied ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            stroke="#22c55e"
            strokeWidth="2"
            fill="none"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            stroke={isDark ? "#94a3b8" : "#6b7280"}
            strokeWidth="2"
            fill="none"
          >
            <rect
              x="9"
              y="9"
              width="13"
              height="13"
              rx="2"
            />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </span>
    );
  }
);

export default CopyAddress;